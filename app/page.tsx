'use client';
import { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
const { v4: uuidv4 } = require('uuid');
var randomColor = require('randomcolor');

import styles from './page.module.css';

type Item = {
  id: any;
  item: string;
  color: string;
  defaultPos: { x: number; y: number };
};

export default function Home() {
  const itemRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  // (
  //   JSON.parse(localStorage.getItem('items')) ?? []
  // );
  useEffect(() => {
    // Check if localStorage is available (client-side)
    if (typeof window !== 'undefined') {
      const storedItemsString = localStorage.getItem('items');
      const storedItems = storedItemsString
        ? JSON.parse(storedItemsString)
        : [];
      setItems(storedItems);
    }
  }, []);

  const newitem = () => {
    if (itemRef.current && itemRef.current.value.trim() !== '') {
      const newItem: Item = {
        id: uuidv4(),
        item: itemRef.current.value,
        color: randomColor({ luminosity: 'light' }),
        defaultPos: { x: 100, y: 0 },
      };
      setItems((prevItems) => [...prevItems, newItem]);
      itemRef.current.value = '';
    } else {
      alert('Enter an item');
    }
  };

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const updatePos = (data: { x: number; y: number }, index: number) => {
    let newArr = [...items];
    newArr[index].defaultPos = { x: data.x, y: data.y };
    setItems(newArr);
  };

  const deleteNote = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className={styles.main}>
      <div className={styles.inputWrapper}>
        <input
          ref={itemRef}
          placeholder="Enter something..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') newitem();
          }}
        />
      </div>
      <button onClick={newitem}>ENTER</button>
      {items.map((item: Item, index: number) => {
        return (
          <Draggable
            key={item.id}
            defaultPosition={item.defaultPos}
            onStop={(e, data) => {
              updatePos(data, index);
            }}
          >
            <div style={{ backgroundColor: item.color }} className={styles.box}>
              {`${item.item}`}
              <button
                className={styles.delete}
                onClick={(e) => deleteNote(item.id)}
              >
                X
              </button>
            </div>
          </Draggable>
        );
      })}
    </div>
  );
}
