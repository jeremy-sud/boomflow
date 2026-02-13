require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const REQUIRED_ORG = process.env.REQUIRED_ORG || "SistemasUrsol";

app.use(cors());
app.use(express.json());

// ============================================================
// MIDDLEWARE: Verify GitHub Token & Org Membership
// ============================================================
async function verifyOrgMembership(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "No autorizado",
      message: "Se requiere un token de GitHub.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 1. Get the user's GitHub profile
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const username = userRes.data.login;

    // 2. Check if user belongs to the required org
    // GET /orgs/{org}/members/{username}
    // Returns 204 if member, 404 or 302 if not
    try {
      await axios.get(
        `https://api.github.com/orgs/${REQUIRED_ORG}/members/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (orgError) {
      if (
        orgError.response &&
        (orgError.response.status === 404 || orgError.response.status === 302)
      ) {
        return res.status(403).json({
          error: "Acceso denegado",
          message: `Lo sentimos, Bloomflow actualmente solo está disponible para miembros de ${REQUIRED_ORG}.`,
        });
      }
      throw orgError;
    }

    // 3. Attach user info to request for downstream use
    req.githubUser = {
      username: username,
      avatar: userRes.data.avatar_url,
      name: userRes.data.name,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({
      error: "Token inválido",
      message: "No se pudo verificar tu identidad con GitHub.",
    });
  }
}

// ============================================================
// ROUTES
// ============================================================

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    org: REQUIRED_ORG,
    timestamp: new Date().toISOString(),
  });
});

// GitHub OAuth: Step 1 - Redirect to GitHub
app.get("/auth/github", (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `http://localhost:${PORT}/auth/github/callback`;
  const scope = "read:org read:user";
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  res.redirect(url);
});

// GitHub OAuth: Step 2 - Exchange code for token
app.get("/auth/github/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res
      .status(400)
      .json({ error: "Código de autorización no proporcionado." });
  }

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      return res
        .status(400)
        .json({
          error: "No se recibió token de acceso.",
          details: tokenRes.data,
        });
    }

    // In production, you'd set this as an HttpOnly cookie or return it securely
    res.json({
      message: "✅ Autenticación exitosa con GitHub",
      access_token: accessToken,
      token_type: tokenRes.data.token_type,
      scope: tokenRes.data.scope,
    });
  } catch (error) {
    console.error("OAuth error:", error.message);
    res.status(500).json({ error: "Error en el proceso de autenticación." });
  }
});

// Protected: Get user badges (requires org membership)
app.get("/api/user/badges", verifyOrgMembership, (req, res) => {
  // Read mock data (in production, this would be a database query)
  const mockPath = path.join(__dirname, "../api-mock.json");
  const badges = JSON.parse(fs.readFileSync(mockPath, "utf8"));

  res.json({
    user: req.githubUser,
    org: REQUIRED_ORG,
    verified: true,
    badges: badges,
  });
});

// ============================================================
// START
// ============================================================
app.listen(PORT, () => {
  console.log(`\n🌸 Bloomflow API Server`);
  console.log(`   Org:  ${REQUIRED_ORG}`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Auth: http://localhost:${PORT}/auth/github`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
