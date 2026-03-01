export function validateEmail(email) {
  const e = (email || "").trim().toLowerCase();
  if (!e) return { ok: false, msg: "Please enter your email." };
  if (!e.includes("@") || !e.includes(".")) {
    return { ok: false, msg: "Please enter a valid email." };
  }
  return { ok: true, value: e };
}

export function validatePassword(password) {
  const p = password || "";
  if (!p) return { ok: false, msg: "Please enter your password." };
  if (p.length < 6) {
    return { ok: false, msg: "Password must be at least 6 characters." };
  }
  return { ok: true, value: p };
}

export function validateFullName(fullName) {
  const n = (fullName || "").trim();
  if (!n) return { ok: false, msg: "Please enter your full name." };
  return { ok: true, value: n };
}

export function validateConfirmPassword(password, confirm) {
  if ((password || "") !== (confirm || "")) {
    return { ok: false, msg: "Passwords do not match." };
  }
  return { ok: true };
}
