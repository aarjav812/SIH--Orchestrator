// Simple agent that uses the provided data handler
// In a real setup, you would wire LangChain tools here; for now, demonstrate the data flow.

class MyAgent {
  constructor(data_handler) {
    this.data_handler = data_handler;
  }

  // Example intent router: very naive, just to prove the flow.
  async handleChat(message, context = {}) {
    const text = String(message || '').toLowerCase();
    if (text.includes('list') && text.includes('employee')) {
      const employees = await this.data_handler.get_employees({});
      return {
        type: 'employees',
        count: employees.length,
        employees,
      };
    }
    if (text.includes('project')) {
      const projects = await this.data_handler.get_projects({});
      return {
        type: 'projects',
        count: projects.length,
        projects,
      };
    }
    // default
    return { type: 'echo', message };
  }
}

module.exports = { MyAgent };
