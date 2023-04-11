import { type FC, type ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import AddModelDialog from "./add-or-update-model-dialog";
import { createSchemaStore } from "~/components/store/schemaStore";
import { shallow } from "zustand/shallow";

const DiagramContextMenu: FC<{ children: ReactNode }> = ({ children }) => {
  const { resetLayout } = createSchemaStore(
    (state) => ({
      resetLayout: state.resetLayout,
    }),
    shallow
  );
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <AddModelDialog>
          <ContextMenuItem
            inset
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            New Model
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
        </AddModelDialog>
        <ContextMenuItem inset>
          New Enum
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset onClick={() => resetLayout()}>
          Auto Layout
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default DiagramContextMenu;
