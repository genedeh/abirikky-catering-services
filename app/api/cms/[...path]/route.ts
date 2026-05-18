import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyCmsRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyCmsRequest(request, context);
}

async function proxyCmsRequest(request: NextRequest, context: RouteContext) {
  const cmsApiUrl = process.env.CMS_API_URL;

  if (!cmsApiUrl) {
    return NextResponse.json(
      { message: "CMS_API_URL is not configured." },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const targetUrl = new URL(
    `/api/public/${path.map(encodeURIComponent).join("/")}`,
    cmsApiUrl,
  );
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const userAgent = request.headers.get("user-agent");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (forwardedFor) {
    headers.set("x-forwarded-for", forwardedFor);
  }

  if (realIp) {
    headers.set("x-real-ip", realIp);
  }

  if (userAgent) {
    headers.set("user-agent", userAgent);
  }

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method === "GET" ? undefined : await request.text(),
    cache: "no-store",
  });

  const responseBody = await response.text();

  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}
