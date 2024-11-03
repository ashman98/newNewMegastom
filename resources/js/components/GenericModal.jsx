import React from "react";
import {
    Dialog,
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button, DialogHeader, DialogBody, DialogFooter,
} from "@material-tailwind/react";

export function GenericModal({
                                 open,
                                 onClose,
                                 title,
                                 children,
                                 size,
                                 confirm = 'Confirm',
                                 cancel = 'Cancel',
                                 onConfirm,
                                 onCancel,
                                 footer= true,
                                 header = true }) {
    return (
        <>
        <Dialog
            open={open}
            size={size || "md"}
            handler={onClose}
        >
            {header ? (
            <DialogHeader>
                <Typography variant="h4" color="blue-gray">
                    {title}
                </Typography>
            </DialogHeader>
            ):null}
            <DialogBody>
                        {children}
            </DialogBody>

            {footer ? (
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => {
                            if (onCancel) onCancel();
                            onClose();
                        }}
                        className="mr-1"
                    >
                        <span>{cancel}</span>
                    </Button>
                    <Button
                        variant="gradient"
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}
                    >
                        <span>{confirm}</span>
                    </Button>
                </DialogFooter>
            ) : null}
        </Dialog>
    </>
    );
}
