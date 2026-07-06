import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.BACKEND_API_URL ||
  "http://192.168.6.128:5000/api";

type BackendUser = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
};

type BackendAuthResponse = {
  message?: string;
  token?: string;
  tocken?: string;
  accessToken?: string;
  user?: BackendUser;
  data?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    phone?: string;
    avatar?: string;
    createdAt?: string;
    token?: string;
    tocken?: string;
    accessToken?: string;
    user?: BackendUser;
  };
};

const readJson = async (response: Response): Promise<BackendAuthResponse> => {
  try {
    return (await response.json()) as BackendAuthResponse;
  } catch {
    return {};
  }
};

const getUser = (data: BackendAuthResponse): BackendUser | null => {
  if (data.user) {
    return data.user;
  }

  if (data.data?.user) {
    return data.data.user;
  }

  if (data.data?.email) {
    return {
      id: data.data.id,
      name: data.data.name,
      email: data.data.email,
      role: data.data.role,
      phone: data.data.phone,
      avatar: data.data.avatar,
      createdAt: data.data.createdAt,
    };
  }

  return null;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${API_URL}/auth/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "Unable to connect to the auth server." }, { status: 502 });
  }

  const data = await readJson(backendResponse);

  if (!backendResponse.ok) {
    return NextResponse.json(
      { message: data.message || "Invalid admin email or password." },
      { status: backendResponse.status }
    );
  }

  const user = getUser(data) || {
    email: body.email,
    name: "Admin",
    role: "admin",
  };

  if (user.role && user.role !== "admin") {
    return NextResponse.json({ message: "Access denied. Admin privileges required." }, { status: 403 });
  }

  const response = NextResponse.json(data, { status: 200 });
  const setCookie = backendResponse.headers.get("set-cookie");

  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
