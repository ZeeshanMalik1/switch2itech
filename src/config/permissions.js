export const ROLE_DATA = {
  admin: {
    sidebar: ['Dashboard', 'Projects', 'Clients', 'Analytics', 'Testimonials', 'Products', 'Support', 'User Management'],
    features: ['add_project', 'manage_users', 'view_revenue', 'assign_tasks'],
    dashboardTitle: "Super Admin Overview"
  },
  user: {
    sidebar: ['Projects', 'Clients', 'Analytics', 'Testimonials', 'Products'],
    features: ['view_only'],
    dashboardTitle: "User Portal"
  },
  client: {
    sidebar: ['Projects', 'Products', 'Testimonials', 'Add Project'],
    features: ['add_review', 'buy_product', 'create_project'],
    dashboardTitle: "Client Dashboard"
  },
  developer: {
    sidebar: ['Dashboard', 'Projects', 'Clients', 'Tasks', 'Milestones'],
    features: ['update_status', 'view_history', 'manage_modules'],
    dashboardTitle: "Developer Workspace"
  },
  manager: {
    sidebar: ['Dashboard', 'Projects', 'Team', 'Analytics'],
    features: ['assign_task', 'manage_developers', 'view_performance'],
    dashboardTitle: "Manager Control Panel"
  }
};