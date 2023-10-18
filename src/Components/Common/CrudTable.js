import React, { useState, useEffect } from 'react';
import { Table, Card, CardBody, CardHeader, Pagination, PaginationItem, PaginationLink, Input, CardFooter, Button } from 'reactstrap';

const CrudTable = ({ data, itemsPerPage, headers, onPageChange, totalItems, onEdit, onDelete, onAdd, onExport }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginateData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    useEffect(() => {
        if (totalItems === 0) {
            setCurrentPage(1);
        }
    }, [totalItems]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            onPageChange(page, itemsPerPage);
        }
    };

    const handleExport = () => {
        onExport(data);
    };

    return (
        <div>
            <Card className="main-card mb-3">
                <CardHeader>Manage Data</CardHeader>
                <CardBody>
                    <div className="d-flex justify-content-between">
                        <div>
                            <Input
                                type="select"
                                style={{ width: '100px' }}
                                value={itemsPerPage}
                                onChange={(e) => {
                                    const newItemsPerPage = parseInt(e.target.value);
                                    setCurrentPage(1);
                                    onPageChange(1, newItemsPerPage);
                                }}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                            </Input>
                        </div>
                        <div>
                            <Button color="primary" onClick={onAdd}>
                                Add
                            </Button>
                            <Button color="success" onClick={handleExport}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className="text-left">
                                        {header}
                                    </th>
                                ))}
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginateData().map((item, index) => (
                                <tr key={item.id}>
                                    {Object.keys(item).map((key) => (
                                        <td key={key} className="text-left">
                                            {key === 'status' ? (
                                                <div className="badge badge-warning">
                                                    {item[key] ? 'Active' : 'Inactive'}
                                                </div>
                                            ) : (
                                                item[key]
                                            )}
                                        </td>
                                    ))}
                                    <td className="text-center">
                                        <Button color="info" size="sm" onClick={() => onEdit(item.id)}>
                                            Edit
                                        </Button>
                                        <Button color="danger" size="sm" onClick={() => onDelete(item.id)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </CardBody>
                <CardFooter>
                    <Pagination>
                        <PaginationItem disabled={currentPage === 1}>
                            <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                        </PaginationItem>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <PaginationItem key={index} active={currentPage === index + 1}>
                                <PaginationLink onClick={() => handlePageChange(index + 1)}>
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem disabled={currentPage === totalPages}>
                            <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                        </PaginationItem>
                    </Pagination>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CrudTable;
