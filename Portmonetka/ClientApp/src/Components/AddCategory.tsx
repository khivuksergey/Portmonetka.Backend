import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { ICategory } from "../DataTypes";

interface AddCategoryProps {
    onAddCategory: (category: ICategory) => Promise<void>
}

export default function AddCategory({ onAddCategory }: AddCategoryProps) {
    const [newCategory, setNewCategory] = useState<ICategory>(
        {
            name: "",
            isExpense: true,
            iconFileName: ""
        });

    const handleAddCategory = () => {
        onAddCategory(newCategory);
    }

    return (
        <Form className="p-3">
            <Row className="mb-2">
                <Col>
                    <Form.Control
                        placeholder="New category"
                        aria-label="Name of category"
                        value={newCategory.name} maxLength={128}
                        onChange={e => {
                            setNewCategory({ ...newCategory, name: e.target.value })
                        }} required />
                </Col>
            </Row>
            <Row className="mb-2">
                <Col>
                    <Form.Check
                        type="switch"
                        id="expense-switch"
                        label="This is expense"
                        checked={newCategory.isExpense}
                        onChange={e => {
                            setNewCategory({ ...newCategory, isExpense: e.target.checked })
                        }}
                    />
                </Col>
            </Row>
            <div className="d-grid">
                <Button className="btn-dark"
                    aria-label="Post new category"
                    onClick={handleAddCategory}>
                    Add
                </Button>
            </div>
        </Form>
    )
}