import React, { useState } from 'react'

function CommentForm() {
    const [comment, setComment] = useState('');

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();
        comment;
    }

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="">Comments</label>
            <input type="text" id='comment' onChange={(e) => setComment(e.target.value)} placeholder='Set your thoughts?' />
            <button type='submit'>Post Comment</button> 
        </form>
    </div>
  )
}

export default CommentForm