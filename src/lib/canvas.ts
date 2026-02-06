import { z } from "zod";

type CanvasRequestOptions = {
  baseUrl: string;
  token: string;
  path: string;
  method?: "GET" | "POST" | "PUT";
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
};

async function canvasRequest<T>(opts: CanvasRequestOptions): Promise<T> {
  const url = new URL(`/api/v1${opts.path}`, opts.baseUrl);
  for (const [k, v] of Object.entries(opts.query ?? {})) {
    if (v === undefined) continue;
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString(), {
    method: opts.method ?? "GET",
    headers: {
      Authorization: `Bearer ${opts.token}`,
      "Content-Type": "application/json"
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Canvas API error ${res.status} ${res.statusText}: ${text.slice(0, 500)}`);
  }

  return (await res.json()) as T;
}

const SelfSchema = z.object({ id: z.number(), name: z.string() });
export async function canvasGetSelf(baseUrl: string, token: string) {
  return SelfSchema.parse(await canvasRequest<unknown>({ baseUrl, token, path: "/users/self" }));
}

const CourseSchema = z.object({ id: z.number(), name: z.string().optional(), course_code: z.string().optional() });
export async function canvasListCourses(baseUrl: string, token: string) {
  const raw = await canvasRequest<unknown[]>({
    baseUrl,
    token,
    path: "/courses",
    query: { per_page: 100, enrollment_type: "teacher" }
  });
  return z.array(CourseSchema).parse(raw).map((c) => ({ id: c.id, name: c.name ?? c.course_code ?? `Course ${c.id}` }));
}

const UserSchema = z.object({ id: z.number(), name: z.string().optional(), sortable_name: z.string().optional() });
export async function canvasListStudents(baseUrl: string, token: string, courseId: number) {
  const raw = await canvasRequest<unknown[]>({
    baseUrl,
    token,
    path: `/courses/${courseId}/users`,
    query: { per_page: 100, "enrollment_type[]": "student" }
  });
  return z.array(UserSchema).parse(raw).map((u) => ({ id: u.id, name: u.name ?? u.sortable_name ?? `Student ${u.id}` }));
}

const AssignmentSchema = z.object({ id: z.number(), name: z.string().optional() });
export async function canvasCreateAssignment(baseUrl: string, token: string, courseId: number, title: string, points: number) {
  const body = { assignment: { name: title, published: true, points_possible: points, submission_types: ["none"] } };
  return AssignmentSchema.parse(await canvasRequest<unknown>({ baseUrl, token, path: `/courses/${courseId}/assignments`, method: "POST", body }));
}

export async function canvasPostGrade(baseUrl: string, token: string, courseId: number, assignmentId: number, studentId: number, postedGrade: number) {
  const url = new URL(`/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions/${studentId}`, baseUrl);
  url.searchParams.set("submission[posted_grade]", String(postedGrade));
  const res = await fetch(url.toString(), { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Canvas grade post failed ${res.status} ${res.statusText}`);
}
