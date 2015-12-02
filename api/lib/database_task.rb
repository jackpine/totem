class DatabaseTask
  def self.exec(task_name, arg_list)
    db_config = Rails.configuration.database_configuration[Rails.env]
    db_script_path = Rails.root.join("../database_tasks/run_task.sh #{task_name}");
    db_env = "DB_NAME=#{db_config['database']} DB_USERNAME=#{db_config['username']} DB_PORT=#{db_config['port']} DB_HOST=#{db_config['host']}"

    Kernel.exec("#{db_env} #{db_script_path} #{arg_list.join(' ')}")

  end
end

