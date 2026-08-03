import { apiFetch } from "./client";
import {
  accountSchema,
  accountAddressSchema,
  type LoginFormValues,
  type SignupFormValues,
  type ProfileFormValues,
  type AddressFormValues,
} from "@/lib/validation/auth";
import { z } from "zod";

// All of these hit the storefront's own /api/session/* and /api/checkout
// proxy routes (baseUrl: "") rather than admin-api directly — the customer
// session cookie is httpOnly and same-origin only, so the browser can't
// attach it to a cross-origin call itself. See src/app/api/session/*.

export async function login(values: LoginFormValues) {
  return apiFetch("/api/session/login", accountSchema, { method: "POST", body: values, baseUrl: "" });
}

export async function signup(values: SignupFormValues) {
  return apiFetch("/api/session/signup", accountSchema, { method: "POST", body: values, baseUrl: "" });
}

export async function loginWithGoogle(idToken: string) {
  return apiFetch("/api/session/google", accountSchema, { method: "POST", body: { idToken }, baseUrl: "" });
}

export async function logout() {
  return apiFetch("/api/session/logout", z.object({ loggedOut: z.boolean() }), { method: "POST", baseUrl: "" });
}

export async function updateProfile(values: ProfileFormValues) {
  return apiFetch("/api/session/profile", accountSchema, {
    method: "PATCH",
    body: { name: values.name, phone: values.phone || null },
    baseUrl: "",
  });
}

export async function createAddress(values: AddressFormValues) {
  return apiFetch("/api/session/addresses", accountAddressSchema, { method: "POST", body: values, baseUrl: "" });
}

export async function updateAddress(id: string, values: Partial<AddressFormValues>) {
  return apiFetch(`/api/session/addresses/${id}`, accountAddressSchema, { method: "PATCH", body: values, baseUrl: "" });
}

export async function deleteAddress(id: string) {
  return apiFetch(`/api/session/addresses/${id}`, z.object({ deleted: z.boolean() }), { method: "DELETE", baseUrl: "" });
}
