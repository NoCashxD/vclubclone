import { React, useState, useEffect } from 'react'
import { toast } from 'react-toastify';
function view(data) {
    const [form, setForm] = useState({
        username: '',
        email: '',
        balance: '',
        role: '',
        access: '',
        refund: ''
    });

    useEffect(() => {
        console.log(data.data)
        setForm(data.data);
    }, [data])
    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async () => {
        // Check for form.username, not data.username
        if (!form.username) {
           return toast.error("Username not found");
        }
        
        try {
            const response = await fetch("/api/admin/users/update", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            
            // Check for non-OK response from the server
            if (!response.ok) {
                const errorData = await response.json();
                return toast.error(errorData.message || "Failed to update user");
            }
            if(response.ok){
                toast.success("User updated successfully!");
                setForm([])
                window.location.href = '/admin';
            }
            
        } catch (error) {
            // Handle any fetch-related or JSON parsing errors
            console.error('Error:', error);
            toast.error(error.message || "An unexpected error occurred");
        }
        
    };
    
    return (
        <div>
            <div className='flex flex-wrap gap-10'>
            <div className="form-row">
                <label>Username</label>
                <input type="text" placeholder={form.username} disabled />
            </div>
            <div className="form-row">
                <label>Email</label>
                <input type="text" placeholder={form.email} disabled />
                </div>
                <div className="form-row">
                    <label>Balance <small>{data.balance}</small></label>
                    <input type="text" placeholder={form.balance} name='balance' onChange={handleInputChange} />
                </div>
                <div className="form-row">
                    <label>Role <small>{data.role}</small></label>
                    <select name="role" id="role" onChange={handleInputChange}>

                        <option value="user">User</option>
                        <option value="ban">Ban</option>
                    </select>
                </div>
                <div className="form-row">
                    <label>Access <small>{data.access}</small></label>
                    <select name="access" id="access" onChange={handleInputChange}>
                        <option value="yes">Allowed</option>
                        <option value="No">Not Allowed</option>
                    </select>
                </div>
                <div className="form-row">
                    <label>Refunds <small>{data.refund || 0}</small></label>
                    <input type="number" placeholder={form.refund || 0} name='refund' onChange={handleInputChange} min="0" />
                </div>
              
            </div>
            <a className='btns btn-sm btn-primary text-xs mt-10' onClick={handleSubmit}>Submit</a></div>
            )
}

            export default view
