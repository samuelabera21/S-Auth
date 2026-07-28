"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { authService } from "@/services/auth";
import { Session } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { getApiErrorMessage } from "@/lib/utils";

function formatDate(dateString: string) {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

function SessionsContent() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadSessions = async () => {
    try {
      const result = await authService.getSessions();
      if (result.success && result.data) {
        setSessions(result.data);
      }
    } catch (error) {
      setMessage({ type: "error", text: getApiErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevoke = async (sessionId: string) => {
    setRevoking(sessionId);
    try {
      const result = await authService.revokeSession(sessionId);
      if (result.success) {
        setMessage({ type: "success", text: result.message || "Session revoked" });
        await loadSessions();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: getApiErrorMessage(error) });
    } finally {
      setRevoking(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar showAuthLinks={false} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Sessions</h1>
          <p className="mt-2 text-gray-600">Manage your active sessions and devices</p>
        </div>

        {message && (
          <Alert variant={message.type} className="mb-6">
            {message.text}
          </Alert>
        )}

        <Card className="overflow-hidden">
          {sessions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No active sessions</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Device</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Browser</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">OS</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Last Used</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Created</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-right py-3 px-6 text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr
                      key={session.id}
                      className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 ${
                        session.isCurrent ? "bg-green-50/50" : ""
                      }`}
                    >
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">{session.device}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{session.browser}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{session.os}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {session.lastUsedAt ? formatDate(session.lastUsedAt) : "Just now"}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        {session.isCurrent ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Current
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {!session.isCurrent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevoke(session.id)}
                            loading={revoking === session.id}
                            disabled={revoking === session.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Revoke
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

export default function SessionsPage() {
  return (
    <ProtectedRoute>
      <SessionsContent />
    </ProtectedRoute>
  );
}
