import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Spinner
} from "@material-tailwind/react";
import './ConfirmDialog.css';

export function ConfirmDialog({
                                  open,
                                  onClose,
                                  title,
                                  children,
                                  size,
                                  confirm = 'Confirm',
                                  cancel = 'Cancel',
                                  onConfirm,
                                  footer= true,
                                  header = true,
                                 isLoading=false
}) {

    return (
        <>
            <Dialog open={open} handler={()=>!isLoading && onClose}  size={size || "md"}>
                {/*{isLoading && (*/}
                {/*    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">*/}
                {/*        <Spinner className="h-16 w-16 text-gray-900/50" />*/}
                {/*    </div>*/}
                {/*)}*/}
                <DialogHeader>{title}</DialogHeader>
                <DialogBody>
                    {children}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="outlined"
                        color="red"
                        className="mr-1"
                        onClick={()=>!isLoading && onClose()}
                        disabled={isLoading}
                    >
                        <span>Չեղարկել</span>
                    </Button>
                    <Button variant="gradient" color="gray"
                            onClick={()=>{
                                !isLoading && onConfirm(true)}}
                            loading={isLoading}
                    >
                        <span>Հաստատել</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
