import React, {useEffect} from 'react';
import './Users.css';

const Users = ({ users }) => {

    return (
        <div className="usersContainer">
            {
                users
                    ? (
                    <div>
                        {users.map( ( { name }, index ) => (
                            <div key={index} className="rectangle">
                                <h3 className="mbtm">{name}</h3>
                                {/* <h5 className="mtp">Student</h5> */}
                            </div>
                        ))}
                    </div>
                    ) : null
            }
        </div>
    )
}

export default Users;