"use client";
import { useUser } from "@clerk/nextjs";
import { boardDataService, boardService, taskService } from "../services";
import { Board, Column, ColumnWithTasks } from "../supabase/models";
import { useEffect, useState } from "react";
import { useSupaBase } from "../supabase/SupaBaseProvider";
import { SupabaseClient } from "@supabase/supabase-js";
import { title } from "process";


export function useBoards() { 
   const {user} = useUser();
   const {supabase} = useSupaBase();
   const [boards,setBoards] = useState<Board[]>([]);
  
   const [loading,setLoading] = useState(true);
   const [error,setError] = useState<string | null>(null);

   useEffect(() => {
    if (user) {
       loadBoards();
    }
   }, [user])
   async function loadBoards() {
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

export function useBoard(boardId: string) {
  
   const {supabase} = useSupaBase();
   const [board,setBoard] = useState<Board | null>(null);
   const [Columns,setColumns] = useState<ColumnWithTasks[]>([]);
   const [loading,setLoading] = useState(true);
   const [error,setError] = useState<string | null>(null);

      useEffect(() => {
    if (boardId) {
       loadBoard();
    }
   }, [boardId])
   async function loadBoard() {
    if (!boardId) return; 
       try {
         setLoading(true);
         setError(null);
        const data = await boardDataService.getBoardWithColumns(
          supabase!, 
          boardId
        );
        setBoard(data.board);
        setColumns(data.columnsWithTasks);
       } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load board.");

       } finally {
        setLoading(false);
       }
   }

   async function updateBoard(boardId: string, updates: Partial<Board>){
      try {
          
         const updatedBoard = await boardService.updateBoard(
           supabase!,
           boardId,
           updates
         );
         setBoard(updatedBoard);
         return updatedBoard;
          
      }
      catch(err) {
         setError(err instanceof Error ? err.message : "Failed to update board.")
      }
          
   }

   async function createRealTast(
      columnId: string,
      taskData: {
         title: string;
         description?: string;
         assignee: string | null;
         dueDate?: string;
         //assigneeId?: string;
         priority?: "low" | "medium" | "high"
      }
   ){

      try {
         const newTask = await taskService.createTask(
           supabase!,
           {
            title: taskData.title,
            description: taskData.description || null,
            due_date: taskData.dueDate || null,
            assignee: taskData.assignee || null,
            priority: taskData.priority || "medium",
            column_id: columnId,
            sort_order: Columns.find(col => col.id === columnId)?.tasks.length || 0,
           
           });

           setColumns((prev) => prev.map((col) => col.id === columnId ?{...col,tasks:[...col.tasks, newTask]} : col ) );
          return newTask;
      }  
      
      catch (err) {
         setError(err instanceof Error ? err.message : "Failed to create task.")
      }
     
      
   }

   return { 
      board,
      Columns,
      loading,
      updateBoard,
      createRealTast,
      error
      } ;


}