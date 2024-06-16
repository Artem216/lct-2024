import { useState, ChangeEvent, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext
} from "@/components/ui/pagination";

interface FileUploaderProps { }

const FileUploader: React.FC<FileUploaderProps> = () => {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<string[][]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6;
    const [uniqueSuperClust, setUniqueSuperClust] = useState<string[]>([]); // State for unique super_clust values
    const [currentClust, setCurrentClust] = useState<string>(""); // State for currently selected super_clust
    const [filteredData, setFilteredData] = useState<string[][]>([]); // State for filtered data based on currentClust
    const [uniqueIds, setUniqueIds] = useState<string[]>([]); // State for unique id values
    const [currentId, setCurrentId] = useState<string>(""); // State for currently selected id
    const [headerRow, setHeaderRow] = useState<string[]>([]); // State for storing header row

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const csvData = e.target?.result as string;
                const rows = csvData.split("\n");
                const headerRow = rows[0].split(",").map((header) =>
                    header.trim().replace(/^"(.+(?="$))"$/, '$1')
                ); // Extract headers directly from first row
                const tableData = rows.slice(1).map((row) => {
                    const regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/;
                    return row.split(regex).map((col) =>
                        col.trim().replace(/^"(.+(?="$))"$/, '$1')
                    );
                });
                setData(tableData);
    
                // Extract unique values from 'super_clust' column
                const superClustIndex = headerRow.findIndex(
                    (header) => header.trim() === 'super_clust'
                );
                if (superClustIndex !== -1) {
                    const uniqueValues = Array.from(
                        new Set(tableData.map((row) => row[superClustIndex]))
                    );
                    setUniqueSuperClust(uniqueValues);
                }
    
                // Extract unique values from 'id' column
                const idIndex = headerRow.findIndex(
                    (header) => header.trim() === 'id'
                );
                if (idIndex !== -1) {
                    const uniqueIds = Array.from(
                        new Set(tableData.map((row) => row[idIndex]))
                    );
                    setUniqueIds(uniqueIds);
                }
    
                // Set header row for table
                setHeaderRow(headerRow);
            };
            reader.readAsText(file);
        }
    };
    
    const handleDeleteFile = () => {
        setData([])
        setFile(null)
        setHeaderRow([])
        setCurrentClust("")
        setFilteredData([])
        setCurrentId("")
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle selection of super_clust value
    const handleSuperClustChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedSuperClust = e.target.value;
        setCurrentClust(selectedSuperClust);
    };

    // Handle selection of id value
    const handleIdChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        setCurrentId(selectedId);
    };

    // Calculate pagination indexes
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Filter data based on currentClust and currentId
    useEffect(() => {
        let filtered = data;
        if (currentClust !== "") {
            filtered = filtered.filter(row => row.some(cell => cell === currentClust));
        }
        if (currentId !== "") {
            const idIndex = headerRow.findIndex(header => header === 'id');
            if (idIndex !== -1) {
                filtered = filtered.filter(row => row[idIndex] === currentId);
            }
        }
        setFilteredData(filtered);
        setCurrentPage(1); // Reset page to 1 when filter changes
    }, [currentClust, currentId, data, headerRow]);

    return (
        <section className="w-full text-black bg-white">
            <div className="container grid gap-8 px-4 md:px-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">CSV File Upload</h2>
                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="file-upload"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                        >
                            Upload CSV
                        </label>
                        <input id="file-upload" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                    </div>
                    {uniqueSuperClust.length > 0 && (
                        <select
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-primary-500/10
                            rounded-tr-[15px] rounded-tl-[44px] rounded-bl-[15px] rounded-br-[44px]"
                            onChange={handleSuperClustChange}
                            value={currentClust}
                        >
                            <option value="">Задать super_clust</option>
                            {uniqueSuperClust.map((value, index) => (
                                <option key={index} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    )}
                    {uniqueIds.length > 0 && (
                        <select
                            className="border border-gray-300 bg-primary-500/10
                            rounded-md px-3 py-2 text-sm rounded-tr-[15px] rounded-tl-[44px] rounded-bl-[15px] rounded-br-[44px]"
                            onChange={handleIdChange}
                            value={currentId}
                        >
                            <option value="">Задать id пользователя</option>
                            {uniqueIds.map((value, index) => (
                                <option key={index} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                {filteredData.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                        <Table className="bg-white">
                            <TableHeader>
                                <TableRow>
                                    {headerRow.map((header, index) => (
                                        <TableHead key={index}>{header}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentItems.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <TableCell key={cellIndex}>{cell}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-center py-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" onClick={handlePrevPage} isActive={currentPage !== 1} />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={handleNextPage}
                                            isActive={!(currentPage === Math.ceil(filteredData.length / itemsPerPage))}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FileUploader;
