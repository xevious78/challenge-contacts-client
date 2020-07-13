import React, { useRef, useEffect } from "react";
import { observer } from "mobx-react";
import { useStores } from "../../stores";
import useComponentSize from "@rehooks/component-size";
import { FixedSizeList as List, ListOnScrollProps } from "react-window";
import ContactCell, { CONTACT_CELL_SIZE } from "./ContactCell";
import styles from "./ContactList.module.scss";
import ClassName from "../../utils/classname";

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
  const { ContactStore, UIStore } = useStores();

  const ref = useRef(null);
  const listRef = useRef<List>(null);
  const firstOnScroll = useRef<boolean>(false);
  const { width, height } = useComponentSize(ref);

  useEffect(() => {
    // Restore scroll offset
    const scrollOffset = UIStore.contactListScrollOffset;
    listRef.current?.scrollTo(scrollOffset);
  }, [UIStore, listRef]);

  ///////////////////////////////////////////
  // List Cb
  ///////////////////////////////////////////

  const handleListScroll = (props: ListOnScrollProps) => {
    if (firstOnScroll.current === false) {
      firstOnScroll.current = true;
      return;
    }

    // Save scroll offset
    UIStore.setContactListScrollOffset(props.scrollOffset);
  };

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  const cellCn = ClassName(styles, "contact-list-cell");

  return (
    <div ref={ref} style={{ height: "100%" }}>
      <List
        ref={listRef}
        itemCount={ContactStore.sortedContacts.length}
        itemSize={CONTACT_CELL_SIZE + 1}
        width={width}
        height={height}
        overscanCount={10}
        onScroll={handleListScroll}
      >
        {({ index, style }) => {
          const contact = ContactStore.sortedContacts[index];
          return (
            <div className={cellCn()} style={style}>
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
