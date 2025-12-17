"use client";
import { useUser } from "@clerk/nextjs";
import { boardDataService, boardService } from "../services";
import { Board } from "../supabase/models";
import { useEffect, useState } from "react";
import { useSupaBase } from "../supabase/SupaBaseProvider";
import { SupabaseClient } from "@supabase/supabase-js";

export function useBoards() { 
   const {user} = useUser();
   const {supabase} = useSupaBase();
   const [boards,setBoards] = useState<Board[]>([]);
   const [loading,setLoading] = useState(true);
   const [error,setError] = useState<string | null>(null);

   useEffect(() => {
    if (user) {
       loadBoard();
    }

   })
   async function loadBoard() {
    if (!user) return; 
       try {
         setLoading(true);
         setError(null);
        const data = await boardService.getBoards(supabase!, user.id);
        setBoards(data);
       } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load board.");

       } finally {
        setLoading(false);
       }
   }
    async function createBoard(boardData: {
    title: string;
    description?: string;
    color?: string;
    }){
        if (!user) throw new Error("User not authenticated");
        try {

            const newBoard = await boardDataService.createBoardWithDefaultColumns(
              supabase!,
                {
        
              ...boardData,
                userId: user.id,
        
        
        
        
            }); 
            setBoards((prev) => [newBoard,...prev]);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Failed to create board.");
            }
          } 

   return { boards, loading, error, createBoard} ;
}    