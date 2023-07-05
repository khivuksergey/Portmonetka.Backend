import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { ICategory } from "../DataTypes";

interface AddCategoryProps {
    onAddCategory: (category: ICategory) => Promise<void>
}

let categoryTemplate: ICategory = {
    name: "",
    isExpense: true,
    iconFileName: ""
}

export default function AddCategory({ onAddCategory }: AddCategoryProps) {
    const [newCategory, setNewCategory] = useState<ICategory>(categoryTemplate);

    const handleAddCategory = () => {
        console.log("new category: ", newCategory);
        onAddCategory(newCategory);
    }

    return (
        <div className="p-3">
            <Row className="mb-3">
                <Col>
                    <Form.Control
                        className="form-control--dark"
                        placeholder="New category"
                        aria-label="Name of category"
                        value={newCategory.name} maxLength={128}
                        onChange={e => {
                            setNewCategory({ ...newCategory, name: e.target.value })
                        }} required />
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Check
                        className=""
                        type="checkbox"
                        label="This is expense"
                        checked={newCategory.isExpense}
                        onChange={e => {
                            setNewCategory({ ...newCategory, isExpense: e.target.checked })
                        }}
                    />
                </Col>
            </Row>
            <div className="d-grid">
                <Button className="btn btn-dark btn-color"
                    aria-label="Post new category"
                    onClick={handleAddCategory}>
                    Add
                </Button>
            </div>
        </div>
    )
}