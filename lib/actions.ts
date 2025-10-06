// actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { ReadingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateBookStatus(bookId: string, status: ReadingStatus) {
  try {
    await prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        status: status,
      },
    });

    // Invalida o cache da página da biblioteca para que ela seja recarregada com os novos dados
    revalidatePath("/biblioteca");
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar o status do livro:", error);
    return { success: false, error: "Não foi possível atualizar o status." };
  }
}