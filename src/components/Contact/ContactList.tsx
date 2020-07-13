import React, { useRef } from "react";
import { observer } from "mobx-react";
import { useStores } from "../../stores";
import useComponentSize from "@rehooks/component-size";
import { FixedSizeList as List } from "react-window";
import ContactCell from "./ContactCell";

type Props = {
  isDeletingContactId: string | null | undefined;
  onContactCellClick: any;
  onContactCellDeleteClick: any;
};

const ContactList = observer((props: Props) => {
  const {
    isDeletingContactId,
    onContactCellClick,
    onContactCellDeleteClick,
  } = props;
  const { ContactStore } = useStores();

  const ref = useRef(null);
  const { width, height } = useComponentSize(ref);

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  return (
    <div ref={ref} style={{ height: "100%" }}>
      <List
        itemCount={ContactStore.sortedContacts.length}
        itemSize={60}
        width={width}
        height={height}
        overscanCount={10}
      >
        {({ index, style }) => {
          const contact = ContactStore.sortedContacts[index];
          return (
            <div style={style}>
              <ContactCell
                key={contact.id}
                isDeleting={contact.id === isDeletingContactId}
                deleteDisabled={!!isDeletingContactId}
                contact={contact}
                onClick={onContactCellClick}
                onDeleteClick={onContactCellDeleteClick}
              />
            </div>
          );
        }}
      </List>
    </div>
  );
});

export default ContactList;
