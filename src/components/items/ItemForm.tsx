import React from 'react';

const ItemForm = () => {
  return (
    <form className="item-form">
      <input type="text" placeholder="Title" />
      <textarea placeholder="Description"></textarea>
      <input type="text" placeholder="Location" />
      <button type="submit">Post Item</button>
    </form>
  );
};

export default ItemForm;
