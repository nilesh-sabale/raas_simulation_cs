import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'
import { Input } from './Input'

interface Column<T> {
    key: keyof T
    header: string
    sortable?: boolean
    render?: (value: any, row: T) => React.ReactNode
    width?: string
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    loading?: boolean
    searchable?: boolean
    pageSize?: number
    className?: string
}

const TableContainer = styled.div`
  background: var(--gradient-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
`

const TableHeaderSection = styled.div`
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHead = styled.thead`
  background: var(--bg-secondary);
`

const TableRow = styled.tr`
  border-bottom: 1px solid var(--border);
  transition: var(--transition-fast);
  
  &:hover {
    background: rgba(37, 99, 235, 0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
`

const TableHeaderCell = styled.th<{ $sortable?: boolean; $width?: string }>`
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: ${props => props.$sortable ? 'pointer' : 'default'};
  user-select: none;
  width: ${props => props.$width || 'auto'};
  
  &:hover {
    ${props => props.$sortable && `
      background: rgba(37, 99, 235, 0.1);
    `}
  }
  
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`

const TableCell = styled.td`
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--text-secondary);
  font-size: 0.875rem;
  vertical-align: middle;
`

const SortIcon = styled.div<{ $direction?: 'asc' | 'desc' }>`
  display: flex;
  align-items: center;
  opacity: ${props => props.$direction ? 1 : 0.3};
  transition: var(--transition-fast);
`

const LoadingRow = styled.tr`
  td {
    padding: var(--spacing-xl);
    text-align: center;
    color: var(--text-muted);
  }
`

const EmptyRow = styled.tr`
  td {
    padding: var(--spacing-xl);
    text-align: center;
    color: var(--text-muted);
  }
`

const Pagination = styled.div`
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
`

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    loading = false,
    searchable = true,
    pageSize = 10,
    className
}: DataTableProps<T>) {
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T | null
        direction: 'asc' | 'desc'
    }>({ key: null, direction: 'asc' })

    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    // Memoized filtered and sorted data
    const processedData = useMemo(() => {
        let filtered = data

        // Apply search filter
        if (searchTerm) {
            filtered = data.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                )
            )
        }

        // Apply sorting
        if (sortConfig.key) {
            filtered = [...filtered].sort((a, b) => {
                const aValue = a[sortConfig.key!]
                const bValue = b[sortConfig.key!]

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1
                }
                return 0
            })
        }

        return filtered
    }, [data, searchTerm, sortConfig])

    // Memoized paginated data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return processedData.slice(startIndex, startIndex + pageSize)
    }, [processedData, currentPage, pageSize])

    const totalPages = Math.ceil(processedData.length / pageSize)

    const handleSort = (key: keyof T) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1) // Reset to first page when searching
    }

    return (
        <TableContainer className={className}>
            {searchable && (
                <TableHeaderSection>
                    <h3>Data Table</h3>
                    <SearchContainer>
                        <Input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            icon={<Search />}
                        />
                    </SearchContainer>
                </TableHeaderSection>
            )}

            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHeaderCell
                                key={String(column.key)}
                                $sortable={column.sortable}
                                $width={column.width}
                                onClick={() => column.sortable && handleSort(column.key)}
                            >
                                {column.header}
                                {column.sortable && (
                                    <SortIcon $direction={sortConfig.key === column.key ? sortConfig.direction : undefined}>
                                        {sortConfig.key === column.key && sortConfig.direction === 'desc' ? (
                                            <ChevronDown size={16} />
                                        ) : (
                                            <ChevronUp size={16} />
                                        )}
                                    </SortIcon>
                                )}
                            </TableHeaderCell>
                        ))}
                    </TableRow>
                </TableHead>

                <tbody>
                    {loading ? (
                        <LoadingRow>
                            <td colSpan={columns.length}>Loading...</td>
                        </LoadingRow>
                    ) : paginatedData.length === 0 ? (
                        <EmptyRow>
                            <td colSpan={columns.length}>No data available</td>
                        </EmptyRow>
                    ) : (
                        paginatedData.map((row, index) => (
                            <TableRow key={index}>
                                {columns.map((column) => (
                                    <TableCell key={String(column.key)}>
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : String(row[column.key] || '-')
                                        }
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <Pagination>
                    <span>
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} entries
                    </span>
                    <div>
                        {/* Pagination controls can be added here */}
                    </div>
                </Pagination>
            )}
        </TableContainer>
    )
}