// =============================================================================
// CLIENTE PRISMA — “telefone” do código para falar com o banco
// =============================================================================
// O que é este arquivo?
//   Exporta UMA instância do PrismaClient. As rotas de API (passos 06+)
//   importam daqui em vez de fazer `new PrismaClient()` em todo lugar.
//
// Por que uma só instância?
//   No `npm run dev` o Next.js recarrega módulos várias vezes. Se cada
//   reload criar um PrismaClient novo, o SQLite pode reclamar de
//   “muitas conexões”. Guardamos a instância em `globalThis` só em
//   desenvolvimento para reaproveitar a mesma conexão.
//
// Como usar (nas APIs):
//   import { prisma } from "@/lib/prisma";
//   const lista = await prisma.denuncia.findMany();
//   const uma = await prisma.denuncia.findUnique({ where: { id: "125172" } });
//
// Check-out 3 · passo 05 (usado pelos passos 06+).
// Guia: docs/11-checkout3-banco-backend.md
// =============================================================================

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

/** @type {PrismaClient} */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Em desenvolvimento, logs de query ajudam a ver o que o banco fez.
    // Em produção (depois do deploy), só erros.
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
