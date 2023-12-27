// import { Button } from "@/components/ui/button";
// import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
// import { Tooltip2 } from "@/components/ui/tooltip2";
// import { formatDate } from "@/lib/utils";
// import { Class, Student } from "@prisma/client";
// import { ColumnDef } from "@tanstack/react-table";
// import { BookPlusIcon, Link, EditIcon, Trash2Icon } from "lucide-react";

// export const classesColumns: ColumnDef<any>[] = [
//   {
//     accessorKey: "course",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Course" />
//     ),
//     cell: ({ row }) => (
//       <span className="font-semibold">
//         {row.original.firstName} {row.original.lastName}
//       </span>
//     ),
//   },
//   {
//     accessorKey: "startDate",
//     header: ({ column }) => (
//       <DataTableColumnHeader
//         className="pl-2 text-xs"
//         column={column}
//         title="Started"
//       />
//     ),
//     cell: ({ row }) => {
//       const classValue = row.original;

//       return <span>{classValue.startDate}</span>;
//     },
//     enableSorting: false,
//   },
//   {
//     accessorKey: "endDate",
//     header: ({ column }) => (
//       <DataTableColumnHeader
//         className="pl-2 text-xs"
//         column={column}
//         title="Ended"
//       />
//     ),
//     enableSorting: false,
//   },
//   {
//     accessorKey: "teacher",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Teacher" />
//     ),
//     cell: ({ row }) => {
//       const created = formatDate(row.original.createdAt);

//       return <span>{created}</span>;
//     },
//   },
//   {
//     accessorKey: "updatedAt",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Updated" />
//     ),
//     cell: ({ row }) => {
//       const updated = formatDate(row.original.updatedAt);

//       return <span>{updated}</span>;
//     },
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const studentId = row.original.id;
//       return (
//         <div className="flex justify-end gap-2">
//           <Tooltip2 text="Add to course" side="top">
//             <Button variant="ghost" className="h-8 w-8 p-0 group ">
//               <BookPlusIcon className="w-4 h-4 text-muted-foreground group-hover:text-green-600" />
//             </Button>
//           </Tooltip2>
//           <Tooltip2 text="Edit" side="top">
//             <Link href={`/school/students/${studentId}`}>
//               <Button variant="ghost" className="h-8 w-8 p-0 group ">
//                 <EditIcon className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
//               </Button>
//             </Link>
//           </Tooltip2>
//           <Tooltip2 text="Delete" side="top">
//             <Button variant="ghost" className="h-8 w-8 p-0 group">
//               <Trash2Icon className="w-4 h-4 text-muted-foreground group-hover:text-rose-600" />
//             </Button>
//           </Tooltip2>
//         </div>
//       );
//     },
//   },
// ];
