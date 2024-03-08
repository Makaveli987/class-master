import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useMultipleSelectDialog from "@/hooks/use-multiple-select-dialog";
import { Check, Loader2Icon } from "lucide-react";
import React, { useEffect } from "react";

export default function MultipleSelectDialog() {
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const {
    options,
    isOpen,
    close,
    onSubmit,
    dialogTitle,
    dialogDescription,
    initialSelectedOptions,
  } = useMultipleSelectDialog();

  useEffect(() => {
    setSelectedOptions(initialSelectedOptions);
  }, [initialSelectedOptions]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (isOpen) {
          close();
          setSelectedOptions([]);
        }
      }}
    >
      <DialogContent className="gap-0 p-0 outline-none">
        <DialogHeader className="px-4 pb-4 pt-5">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Command className="overflow-hidden rounded-t-none border-t bg-transparent">
          <CommandInput placeholder="Search option..." />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup className="p-2">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  className="flex items-center h-9 px-1 py-3 hover:bg-muted cursor-pointer"
                  onSelect={() => {
                    if (selectedOptions.includes(option.value)) {
                      return setSelectedOptions(
                        selectedOptions.filter(
                          (selectedUser) => selectedUser !== option.value
                        )
                      );
                    }

                    setSelectedOptions([...selectedOptions, option.value]);
                  }}
                >
                  <div className="ml-2">
                    <p className="text-sm font-medium leading-none">
                      {option.label}
                    </p>
                  </div>
                  {selectedOptions.includes(option.value) ? (
                    <Check className="ml-auto flex h-4 w-4 text-primary" />
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <DialogFooter className="flex items-center border-t p-4 sm:justify-end">
          <Button
            disabled={isSubmitting}
            variant={"outline"}
            onClick={() => {
              close();
              setSelectedOptions([]);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={async () => {
              setIsSubmitting(true);
              await onSubmit(selectedOptions).finally(() => {
                close();
                setIsSubmitting(false);
              });
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
