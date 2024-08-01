'use client'
import React, {useState, useEffect} from "react";
import { collection, addDoc, getDoc, QuerySnapshot, query, onSnapshot, deleteDoc, doc } from "firebase/firestore"; 
import {db} from './firebase'

export default function Home() {
  const [items, setItems] = useState([
    {name: 'apple', quantity: 4}
  ]);

  const [newItem, setNewItem] = useState({name: '', quantity: ''})
  const [total, setTotal] = useState(0)

  //adding items

  const addItem = async(e) => {
    e.preventDefault()
    if (newItem.name != '' && newItem.quantity != '') {
      //setItems([...items,newItem]);
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(), quantity: newItem.quantity
      });
      setNewItem({name:'', quantity:''});
    }
  }

  //reading items

  useEffect(() => {
    const q = query(collection(db, 'items'))
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let itemsArr = []
      QuerySnapshot.forEach((doc) => {
        itemsArr.push({...doc.data(), id: doc.id})
      })
      setItems(itemsArr)
    })
  }, [])

  //deleting items

  const deleteItem = async(id) => {
    await deleteDoc(doc(db, 'items', id));
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black">
            <input value = {newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="col-span-3 p-3 border" type="text" placeholder="Enter item"></input>
            <input value={newItem.quantity} onChange={(e) => setNewItem({...newItem, quantity: e.target.value})} className="col-span-2 p-3 border mx-3" type="number" placeholder="Enter quantity"></input>
            <button onClick={addItem} className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl" type="submit">+</button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li key = {id} className="my-4 w-full flex justify-between">
                <div className="p-4 w-full flex justify-between">
                  <span>{item.name}</span>
                  <span>{item.quantity}</span>
                </div>
                <button onClick={() => deleteItem(item.id)}>X</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
