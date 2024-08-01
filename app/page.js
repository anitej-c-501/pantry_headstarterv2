'use client'
import React, { useState, useEffect } from "react";
import { collection, addDoc, query, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore"; 
import { db } from './firebase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Adding or updating items
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.quantity !== '') {
      if (editItem) {
        // Update existing item
        await updateDoc(doc(db, 'items', editItem.id), {
          name: newItem.name.trim(),
          quantity: newItem.quantity,
        });
        setEditItem(null);
      } else {
        // Add new item
        await addDoc(collection(db, 'items'), {
          name: newItem.name.trim(),
          quantity: newItem.quantity,
        });
      }
      setNewItem({ name: '', quantity: '' });
    }
  };

  // Reading items
  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let itemsArr = [];
      QuerySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);
    });
    return () => unsubscribe();
  }, []);

  // Deleting items
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  // Set item for editing
  const startEditing = (item) => {
    setNewItem({ name: item.name, quantity: item.quantity });
    setEditItem(item);
  };

  // Filtered items based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black" onSubmit={handleSubmit}>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-3 p-3 border"
              type="text"
              placeholder="Enter item"
            />
            <input
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              className="col-span-2 p-3 border mx-3"
              type="number"
              placeholder="Enter quantity"
            />
            <button className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl" type="submit">
              {editItem ? 'Update' : 'Add'}
            </button>
          </form>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="my-4 p-3 border w-full bg-white text-black"
            type="text"
            placeholder="Search items..."
          />
          <ul>
            {filteredItems.map((item) => (
              <li key={item.id} className="my-4 w-full flex justify-between">
                <div className="p-4 w-full flex justify-between">
                  <span>{item.name}</span>
                  <span>{item.quantity}</span>
                  <button onClick={() => startEditing(item)} className="text-blue-500">Edit</button>
                  <button onClick={() => deleteItem(item.id)} className="text-red-500">X</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
