import { FaTicketAlt, FaHourglassHalf, FaStar, FaEye } from 'react-icons/fa';
import './SupportFeedback.css';

const SupportFeedback = () => {
  const stats = [
    {
      title: 'Open Tickets',
      value: '125',
      icon: FaTicketAlt,
      iconColor: '#ef4444'
    },
    {
      title: 'Avg. Response Time',
      value: '3.5 Hours',
      icon: FaHourglassHalf,
      iconColor: '#3b82f6'
    },
    {
      title: 'Avg. Feedback Rating',
      value: '4.2 / 5',
      icon: FaStar,
      iconColor: '#fbbf24'
    }
  ];

  const tickets = [
    {
      id: '#78923',
      user: {
        name: 'Alex Johnson',
        avatar: 'AJ'
      },
      subject: 'Unable to upload resume',
      category: 'Technical Issue',
      priority: 'High',
      priorityColor: 'danger',
      status: 'Open',
      statusColor: 'danger',
      lastUpdated: '2 hours ago'
    },
    {
      id: '#78922',
      user: {
        name: 'Maria Garcia',
        avatar: 'MG'
      },
      subject: 'Feedback on new UI',
      category: 'General Feedback',
      priority: 'Medium',
      priorityColor: 'warning',
      status: 'In Progress',
      statusColor: 'primary',
      lastUpdated: '1 day ago'
    },
    {
      id: '#78921',
      user: {
        name: 'James Smith',
        avatar: 'JS'
      },
      subject: 'Question about subscription',
      category: 'Billing Inquiry',
      priority: 'Low',
      priorityColor: 'success',
      status: 'Resolved',
      statusColor: 'success',
      lastUpdated: '3 days ago'
    },
    {
      id: '#78920',
      user: {
        name: 'Linda Williams',
        avatar: 'LW'
      },
      subject: 'Cannot reset my password',
      category: 'Account Problem',
      priority: 'Low',
      priorityColor: 'success',
      status: 'Closed',
      statusColor: 'secondary',
      lastUpdated: '5 days ago'
    }
  ];

  return (
    <div className="support-page">
      {/* Page Header */}
      <div className="page-header-section mb-4">
        <h1 className="page-title">Support & Feedback</h1>
        <p className="page-subtitle">Manage user support tickets and feedback.</p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-lg-4 col-md-6 mb-3">
            <div className="support-stat-card">
              <div 
                className="support-stat-icon"
                style={{ backgroundColor: stat.iconColor + '20', color: stat.iconColor }}
              >
                <stat.icon />
              </div>
              <div className="support-stat-content">
                <p className="support-stat-title">{stat.title}</p>
                <h3 className="support-stat-value">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs-section mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" href="#">Support Tickets</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Feedback</a>
          </li>
        </ul>
      </div>

      {/* Filters */}
      <div className="filters-section mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-auto">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="bulkActions" />
              <label className="form-check-label" htmlFor="bulkActions">
                Bulk Actions
              </label>
            </div>
          </div>
          <div className="col">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search..."
            />
          </div>
          <div className="col-auto">
            <select className="form-select">
              <option>All Categories</option>
              <option>Technical Issue</option>
              <option>General Feedback</option>
              <option>Billing Inquiry</option>
              <option>Account Problem</option>
            </select>
          </div>
          <div className="col-auto">
            <select className="form-select">
              <option>All Status</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="table support-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" className="form-check-input" />
                </th>
                <th>Feedback ID</th>
                <th>User</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>
                    <input type="checkbox" className="form-check-input" />
                  </td>
                  <td className="ticket-id">{ticket.id}</td>
                  <td>
                    <div className="user-info-cell">
                      <div className="user-avatar-sm">{ticket.user.avatar}</div>
                      <span>{ticket.user.name}</span>
                    </div>
                  </td>
                  <td>{ticket.subject}</td>
                  <td>{ticket.category}</td>
                  <td>
                    <span className={`badge priority-badge priority-${ticket.priorityColor}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge status-badge status-${ticket.statusColor}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="text-muted">{ticket.lastUpdated}</td>
                  <td>
                    <a href="#" className="view-link">
                      <FaEye className="me-1" />
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupportFeedback;