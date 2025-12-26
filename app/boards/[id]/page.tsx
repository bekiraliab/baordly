"use client"
import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader,Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBoard, useBoards, } from "@/lib/hooks/useBoards";
import { ColumnWithTasks } from "@/lib/supabase/models";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MoreHorizontal, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

function Column({column,children,onCreateTask,onEditColumn}: {
    column: ColumnWithTasks,
    children?: React.ReactNode,
    onCreateTask?: (taskData: any) => Promise<void>,
    onEditColumn?: (column: ColumnWithTasks) => Promise<void>,
}) {

   return (
   
   <div className="w-full lg:flex-shrink-0 lg:w-80">
    <div className="bg-white rounded-lg shadow-sm border">
        {/* Column Header */}
     <div className="p-3 sm:p-4 border-b">
       <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{column.title}</h3>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
                {column.tasks.length} 
            </Badge>
        </div>
        <Button variant="ghost" size="sm" className="flex-shrink-0">
          <MoreHorizontal />  
        </Button>
       </div>
     </div> 
        {/* Column content */}
       <div className="p-2">{children}</div>


    </div>
   </div>
   );
}

export default function BoardPage() {
    const {id} = useParams<{id: string}>(); 
    const {board, updateBoard, Columns} = useBoard(id);
    const [isEditingTitle,setIsEditingTitle] = useState(false);
    const [newTitle,setNewTitle] = useState("");
    const [newColor,setNewColor] = useState("");
    const [isFilterOpen,setIsFilterOpen] = useState(false);

    async function handleUpdateBoard(e: React.FormEvent) {
        e.preventDefault();
        if (!newTitle.trim() || !board) return;

        try {
            await updateBoard(board.id,{
                title: newTitle.trim(),
                color: newColor || board.color,
            });
            setIsEditingTitle(false);
        }
        catch {

        }
    }

return (
<div className="min-h-screen bg-gray-50">
    <Navbar
     boardTitle={board?.title} 
     onEditBoard={()=> {

        setNewTitle(board?.title ?? "");
        setNewColor(board?.color ?? "");
        setIsEditingTitle(true);
    }} 
    onFilterClick={() => setIsFilterOpen(true)}
    filterCount={0}
    />
    <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
      <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
        <DialogHeader>
            <DialogTitle>
                Edit Board
            </DialogTitle>
        </DialogHeader>
         <form className="space-y-4" onSubmit={handleUpdateBoard}>
            <div className="space-y-2">
                <Label htmlFor="boardTitle">
                    Board Title 
                </Label>
                <Input id="boardTitle"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter board title..." 
                required
                />
            </div>
            <div className="space-y-2">
                <Label>
                    Board Color
                </Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {["bg-blue-500",
                      "bg-green-500",
                      "bg-yellow-500",
                      "bg-red-500",
                      "bg-purple-500",
                      "bg-pink-500",
                      "bg-indigo-500",
                      "bg-gray-500",
                      "bg-orange-500",
                      "bg-teal-500",
                      "bg-cyan-500",
                      "bg-emerald-500",
                      ].map((color, key) => (
                     <button 
                      key= {key}
                      type="button"
                     className={`w-8 h-8 rounded-full ${color} ${color === newColor
                         ? "ring-2 ring-offset-2 ring-gray-900"
                          : ""
                     }`}
                     onClick={() => setNewColor(color)}
                     />

                    ))}
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <Button
                type="button"
                variant="outline"
                onClick={()=> setIsEditingTitle(false)}
                >
                    Cancel
                </Button>
                <Button type="submit">
                    Save Changes
                </Button>
            </div>
         </form>
      </DialogContent>  
    </Dialog>
    <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
        <DialogHeader>
            <DialogTitle>
                Filter Tasks
            </DialogTitle>
            <p className="text-sm text-gray-600">Filter Tasks by priority, assignee, or status</p>
        </DialogHeader>
         <div className="space-y-4">
            <div className="space-y-2">
                <label>Priority</label>
                <div className="flex flex-wrap gap-2">
                    {["High","Medium","Low"].map((priority,key) => (
                       <Button key={key} variant="outline" size="sm">
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                       </Button> 
                    ))}
                </div>
            </div>
            {/*<div className="space-y-2">
                <label>Assignee</label>
                <div className="flex flex-wrap gap-2">
                    {["High","Medium","Low"].map((priority,key) => (
                       <Button key={key} variant="outline" size="sm">
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                       </Button> 
                    ))}
                </div>
            </div>*/}
            <div className="space-y-2">
                <label>Due Date</label>
                <Input type="date" />
            </div>
              <div className="flex justify-between pt-4">
                <Button type="button" variant={"outline"}>
                    Clear Filters
                </Button>
                <Button type="button" onClick={()=> setIsFilterOpen(false)}>Apply Filters</Button>
              </div>
         </div>
        </DialogContent>
    </Dialog>

 {/* Board content goes here */}

  <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
    {/* stats*/}

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
     <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">
                Total Tasks : </span>
            {Columns.reduce((sum , col) => sum + col.tasks.length, 0)}
        </div>
     </div>
      
      {/* Add tasks */}
      <Dialog>
        <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
                <Plus />
                 Add Task 
            </Button>
        </DialogTrigger>
          
          <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
        <DialogHeader>
            <DialogTitle>
                Create New Task
            </DialogTitle>
            <p className="text-sm text-gray-600">
                Add a task to the board 
            </p>
        </DialogHeader>
        <form className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input id="title" name="title" placeholder="enter task title"/>  
            </div>

             <div className="space-y-2">
              <Label>Description</Label>
              <Textarea id="description" name="description" placeholder="enter task description" rows={3}/>  
            </div>

             <div className="space-y-2">
              <Label>Assigne</Label>
              <Input id="assigne" name="assigne" placeholder="who should do this task"/>  
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select name="priority" defaultValue="Medium">
               <SelectTrigger>
                <SelectValue/>
               </SelectTrigger>
                <SelectContent>
                     {["High","Medium","Low"].map((priority,key) => (
                       <SelectItem key={key} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                       </SelectItem> 
                    ))}
                </SelectContent>      
              </Select>
            </div>
            <div className="space-y-2">
                <label>Due Date</label>
                <Input  type="date" id="dueDate" name="dueDate"/>
            </div>
            
             <div className="flex justify-end space-x-2 pt-4">
                <Button type="submit">
                  Create Task  
                </Button>
            </div>

        </form>
        </DialogContent>

      </Dialog>
    </div>

    {/* Columns */}

     <div>
        {Columns.map((column, key) => (
            <Column  key={key} column={column} 
            onCreateTask={() => {}} 
            onEditColumn={() => {}}
            >
               <div>
                {column.tasks.map((task,key) => (
                    <div>{task.title}</div>
                    ))} 
               </div> 
            </Column>
        )
        )}
     </div>

  </main>

</div>
);
}