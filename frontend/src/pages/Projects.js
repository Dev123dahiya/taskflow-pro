import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const { isAdmin, request } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [memberEmails, setMemberEmails] = useState({});

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      setProjects(await request("/api/projects"));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await request("/api/projects", { method: "POST", body: JSON.stringify(form) });
      setForm({ name: "", description: "" });
      toast.success("Project created");
      fetchProjects();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const addMember = async (projectId) => {
    try {
      await request(`/api/projects/${projectId}/members`, {
        method: "POST",
        body: JSON.stringify({ email: memberEmails[projectId] })
      });
      setMemberEmails({ ...memberEmails, [projectId]: "" });
      toast.success("Member added");
      fetchProjects();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await request(`/api/projects/${projectId}`, { method: "DELETE" });
      toast.success("Project deleted");
      fetchProjects();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeMember = async (projectId, memberId) => {
    try {
      await request(`/api/projects/${projectId}/members/${memberId}`, { method: "DELETE" });
      toast.success("Member removed");
      fetchProjects();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <LoadingState label="Loading projects..." />;

  return (
    <>
      <PageHeader
        eyebrow="Project management"
        title="Projects"
        description={isAdmin ? "Create project spaces and add member accounts by email." : "View the projects where you are a member."}
      />

      {isAdmin && (
        <form onSubmit={createProject} className="mb-6 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
            <input className="form-input" placeholder="Project name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <input className="form-input" placeholder="Project description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
            <button className="btn-primary" type="submit" disabled={saving}>{saving ? "Creating..." : "Create Project"}</button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <EmptyState title="No projects yet" message={isAdmin ? "Create the first project to start assigning team work." : "Ask an admin to add you to a project."} />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {projects.map((project) => (
            <article key={project._id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">{project.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                </div>
                {isAdmin && <button className="btn-danger" type="button" onClick={() => deleteProject(project._id)}>Delete</button>}
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Members</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.members?.length ? project.members.map((member) => (
                    <span key={member._id} className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {member.name} ({member.email})
                      {isAdmin && (
                        <button
                          type="button"
                          className="font-bold text-slate-500 hover:text-red-600"
                          onClick={() => removeMember(project._id, member._id)}
                          aria-label={`Remove ${member.name}`}
                        >
                          x
                        </button>
                      )}
                    </span>
                  )) : <span className="text-sm text-slate-500">No members added</span>}
                </div>
              </div>

              {isAdmin && (
                <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input className="form-input" type="email" placeholder="member@email.com" value={memberEmails[project._id] || ""} onChange={(event) => setMemberEmails({ ...memberEmails, [project._id]: event.target.value })} />
                  <button className="btn-secondary" type="button" onClick={() => addMember(project._id)}>Add Member</button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
};

export default Projects;
