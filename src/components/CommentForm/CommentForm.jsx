import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import * as hootService from '../../services/hootService';
import { useNavigate } from 'react-router-dom';

const CommentForm = ({ handleAddComment}) => {
    const [formData, setFormData] = useState({
        text: '',
    })

    const { hootId, commentId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHoot = async () => {
          const hootData = await hootService.show(hootId);
          // Find comment in fetched hoot data
          setFormData(hootData.comments.find((comment) => comment._id === commentId));
        };
        if (hootId && commentId) fetchHoot();
      }, [hootId, commentId]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (hootId && commentId) {
          hootService.updateComment(hootId, commentId, formData);
          navigate(`/hoots/${hootId}`);
        } else {
          handleAddComment(formData);
        }
        setFormData({ text: '' });
      };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="text-input">Your comment: </label>
            <textarea 
                type="text"
                name="text"
                id="text-input"
                value={formData.text}
                onChange={handleChange}
                required
            />
            <button type="submit">SUBMIT COMMENT</button>
        </form>
    )
}

export default CommentForm;