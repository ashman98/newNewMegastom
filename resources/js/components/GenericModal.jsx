import React, {useEffect} from "react";
import {
    Dialog,
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button, DialogHeader, DialogBody, DialogFooter,
} from "@material-tailwind/react";
import useWindowSize from "@/hooks/useWindowSize.js";

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
    // useEffect(() => {
    //     if (open) {
    //         // Add overflow to the body to make the main screen scrollable
    //         document.body.style.overflowY = 'auto';
    //     } else {
    //         // Remove overflow when modal is closed
    //         document.body.style.overflowY = 'auto';
    //     }
    //     return () => {
    //         // Clean up the effect
    //         document.body.style.overflowY = 'auto';
    //     };
    // }, [open]);

    const {width, height} = useWindowSize();

    return (
        <>
        <Dialog
            open={open}
            size={size || "md"}
            handler={onClose}
            className={`${width < 536?"max-h-[90vh]" : "lg:max-h-[100vh] sm:max-h-[90vh]"}  overflow-y-auto custom-scrollbar`}
        >
            {header ? (
            <DialogHeader>
                <Typography variant="h4" color="gray">
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
