import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import AdminLayout from '../../components/dashboard/AdminLayout'

function AdminDormsPage() {
  const [dorms, setDorms] = useState([])

  useEffect(() => {
    api.get('/dorms').then(({ data }) => setDorms(data.dorms)).catch(() => setDorms([]))
  }, [])

  return (
    <AdminLayout>
      <div className="section-header">
        <h1>Dorms</h1>
        <div className="row-gap">
          <Link to="/admin/dorms/add" className="btn btn-outline">Add Dorm</Link>
          <Link to="/admin/rooms/add" className="btn btn-primary">Add Room</Link>
        </div>
      </div>

      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Block</th>
                <th>Address</th>
                <th>Rooms</th>
                <th>Total Seats</th>
                <th>Available Seats</th>
              </tr>
            </thead>
            <tbody>
              {dorms.map((dorm) => (
                <tr key={dorm._id}>
                  <td>{dorm.name}</td>
                  <td>{dorm.block}</td>
                  <td>{dorm.address}</td>
                  <td>{dorm.roomCount}</td>
                  <td>{dorm.totalSeats}</td>
                  <td>{dorm.availableSeats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  )
}

export default AdminDormsPage
