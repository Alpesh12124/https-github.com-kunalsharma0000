import React from 'react'
import { useState } from 'react';
import { useAuth } from "../contexts/AuthContext"
import { ROOT_FOLDER } from '../hooks/useFolder';
import { Button, Modal, Form } from "react-bootstrap"
import { database } from '../firebase';


export default function AddFolderButton({currentFolder}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const { currentUser } = useAuth();

    function openModal() {
        setOpen(true);
    }

    function closeModal() {
        setOpen(false);
    }
    
    function handleSubmit(e){
        e.preventDefault();
        
        if (currentFolder == null) return

        const path = [...currentFolder.path]
        if (currentFolder !== ROOT_FOLDER) {
          path.push({ name: currentFolder.name, id: currentFolder.id })
        }
    
        database.folders.add({
          name: name,
          parentId: currentFolder.id,
          userId: currentUser.uid,
          path: path,
          createdAt: database.getCurrentTimestamp(),
        })
        setName("")
        closeModal()
    }

    return (
        <>
            <Button onClick={openModal} variant="outline-success" size="sm">
                Add Folder
            </Button>
            <Modal show={open} onHide={closeModal}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Folder Name</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Close
                        </Button>
                        <Button variant="success" type="submit">
                            Add Folder
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}