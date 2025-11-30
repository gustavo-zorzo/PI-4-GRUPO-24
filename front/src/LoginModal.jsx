import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export function LoginModal({ isOpen, onClose, onLoggedIn }) {
  const [isSignup, setIsSignup] = useState(false);

  
  const [passwordError, setPasswordError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((p) => ({ ...p, [name]: value }));

    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (isSignup && formData.password !== formData.confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return;
    }

    try {
      
      if (!isSignup) {
        const userCandidate = (formData.email || "").trim();
        const passCandidate = (formData.password || "").trim();
        if (userCandidate === "admin" && passCandidate === "admin") {
          const userObj = { id: "local-admin", name: "admin", email: "admin" };
          localStorage.setItem("hs_user", JSON.stringify(userObj));
          onLoggedIn?.(userObj);
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });
          setIsSignup(false);
          onClose?.();
          return;
        }
      }

      let response;

      if (isSignup) {
        response = await fetch("http://localhost:8080/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: "USER",
          }),
        });
      } else {
        response = await fetch("http://localhost:8080/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
      }

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        setPasswordError(error?.error || "Erro ao processar a requisição.");
        return;
      }

      const user = await response.json();

      
      localStorage.setItem("hs_user", JSON.stringify(user));
      
      onLoggedIn?.(user, { signup: !!isSignup });

      
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setIsSignup(false);
      onClose?.();
    } catch (err) {
      console.error(err);
      setPasswordError("Erro ao conectar ao servidor.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md px-4 -translate-x-1/2 -translate-y-1/2"
          >
            <Card className="rounded-2xl border border-slate-200 shadow-lg bg-white dark:border-slate-700 dark:bg-slate-900">
              <CardHeader className="relative flex items-center justify-between pb-2 px-6 pt-6">
                <CardTitle className="text-2xl text-slate-900 dark:text-slate-50">
                  {isSignup ? "Cadastro" : "Login"}
                </CardTitle>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1 hover:bg-muted/10"
                >
                  <X className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                </button>
              </CardHeader>

              <CardContent className="px-6 pb-6 text-slate-900 dark:text-slate-50">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignup && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-foreground">
                        Nome completo
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-white text-slate-900 border border-slate-200 rounded-md px-3 py-2 dark:bg-slate-800 dark:text-slate-50 dark:border-slate-700"
                      />
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      {isSignup ? "Email" : "Usuário ou Email"}
                    </label>
                    <Input
                      type={isSignup ? "email" : "text"}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={isSignup ? undefined : "admin"}
                      className="bg-white text-slate-900 border border-slate-200 rounded-md px-3 py-2 dark:bg-slate-800 dark:text-slate-50 dark:border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Senha
                    </label>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="bg-white text-slate-900 border border-slate-200 rounded-md px-3 py-2 dark:bg-slate-800 dark:text-slate-50 dark:border-slate-700"
                    />
                    {passwordError && (
                      <p className="text-xs text-red-500 mt-1">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  {isSignup && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-foreground">
                        Confirmar Senha
                      </label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="bg-white text-slate-900 border border-slate-200 rounded-md px-3 py-2 dark:bg-slate-800 dark:text-slate-50 dark:border-slate-700"
                      />
                      {passwordError && (
                        <p className="text-xs text-red-500 mt-1">
                          {passwordError}
                        </p>
                      )}
                    </div>
                  )}

                  <Button type="submit" className="mt-4 w-full">
                    {isSignup ? "Cadastrar" : "Entrar"}
                  </Button>
                </form>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                  {isSignup ? "Já tem conta? " : "Não tem conta? "}
                  <button
                    onClick={() => {
                      setIsSignup((s) => !s);
                      setPasswordError("");
                    }}
                    className="font-semibold text-primary hover:underline"
                  >
                    {isSignup ? "Faça login" : "Cadastre-se"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;
