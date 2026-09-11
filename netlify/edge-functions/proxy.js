export default async (request, context) => {
  const secretKey = request.headers.get("X-Auth-Key");
  if (secretKey !== "MicrosoftInternal") {
    return new Response("Да пошел ты нахуй пидор блять", { status: 403 });
  }

  const url = new URL(request.url);
  const library = url.searchParams.get("libraries");
  
  if (!library) {
    return new Response("Missing ?libraries parameter", { status: 400 });
  }

  const codebergUrl = `https://codeberg.org/defensow/microsoft-library/raw/branch/main/${library}`;
  
  const response = await fetch(codebergUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
  });

  if (!response.ok) {
    return new Response("Not found", { status: 404 });
  }

  const blob = await response.arrayBuffer();
  
  return new Response(blob, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Access-Control-Allow-Origin": "*",
      "Content-Disposition": `attachment; filename="${library}"`
    }
  });
};
