
import { useNavigate } from "react-router";
import { Users, Clock, Code2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getDifficultyBadgeClass } from "../lib/utils";

function ActiveSessions({
  sessions = [],
  isLoading,
  isUserInSession,
}) {
  const navigate = useNavigate();

  return (
    <div className="lg:col-span-2 card bg-base-100 border-2 border-primary/20">
      <div className="card-body">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black">Active Sessions</h2>
          <span className="badge badge-success">
            {sessions.length} Live
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto opacity-30 mb-3" />
            <p>No active sessions available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session) => {
              const joined = isUserInSession(session);
              const full = Boolean(session.participant);

              return (
                <div
                  key={session._id}
                  className="card bg-base-200 border border-base-300"
                >
                  <div className="card-body p-5">
                    <div className="flex items-center gap-2">
                      <Code2 className="text-primary" />
                      <h3 className="font-bold truncate">
                        {session.problem}
                      </h3>
                    </div>

                    <span
                      className={`badge w-fit ${getDifficultyBadgeClass(
                        session.difficulty
                      )}`}
                    >
                      {session.difficulty}
                    </span>

                    <p className="text-sm opacity-70">
                      Host: {session.host?.name || "Unknown"}
                    </p>

                    <p className="text-sm opacity-70 flex gap-2 items-center">
                      <Users size={15} />
                      {full ? "2/2 participants" : "1/2 participants"}
                    </p>

                    <p className="text-sm opacity-70 flex gap-2 items-center">
                      <Clock size={15} />
                      {formatDistanceToNow(
                        new Date(session.createdAt),
                        { addSuffix: true }
                      )}
                    </p>

                    <button
                      className="btn btn-primary btn-sm mt-3"
                      disabled={!joined && full}
                      onClick={() =>
                        navigate(`/session/${session._id}`)
                      }
                    >
                      {joined
                        ? "Continue Session"
                        : full
                        ? "Session Full"
                        : "Join Session"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActiveSessions;
