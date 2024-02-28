Let's dive into a comprehensive explanation of the commands listed from each PDF document, including examples and commonly used parameters.

### Git Commands

#### 1. `git add`
- **Usage**: Adds files to the staging area before committing.
- **Example**: Add all files in the current directory.
  ```bash
  git add .
  ```

#### 2. `git commit`
- **Usage**: Commits the staged changes to the repository.
- **Example**: Commit with a message.
  ```bash
  git commit -m "Add new feature"
  ```

#### 3. `git push`
- **Usage**: Pushes commits to a remote repository.
- **Example**: Push to the main branch.
  ```bash
  git push origin main
  ```

#### 4. `git remote add`
- **Usage**: Adds a new remote repository.
- **Example**: Add a remote repository named "origin".
  ```bash
  git remote add origin https://github.com/user/repo.git
  ```

#### 5. `git config`
- **Usage**: Configures Git settings.
- **Example**: Set email for commits.
  ```bash
  git config --global user.email "email@example.com"
  ```

#### 6. `git diff`
- **Usage**: Shows changes between commits, commit and working tree, etc.
- **Example**: Show diff of staged changes.
  ```bash
  git diff --staged
  ```

#### 7. `git stash`
- **Usage**: Stashes changes in a dirty working directory.
- **Example**: Stash changes with a message.
  ```bash
  git stash push -m "WIP: making changes"
  ```

#### 8. `git status`
- **Usage**: Shows the working tree status.
- **Example**:
  ```bash
  git status
  ```

#### 9. `git log`
- **Usage**: Shows the commit logs.
- **Example**: Show log with a graph.
  ```bash
  git log --graph
  ```

#### 10. `git checkout`
- **Usage**: Switches branches or restores working tree files.
- **Example**: Switch to a branch named "feature".
  ```bash
  git checkout feature
  ```

#### 11. `git revert`
- **Usage**: Reverts some existing commits.
- **Example**: Revert a commit by its SHA.
  ```bash
  git revert a1b2c3d
  ```

#### 12. `git commit --amend`
- **Usage**: Amends the most recent commit.
- **Example**: Amend commit with new changes staged.
  ```bash
  git commit --amend -m "New commit message"
  ```

#### 13. `git reset`
- **Usage**: Resets current HEAD to the specified state.
- **Example**: Soft reset to a commit.
  ```bash
  git reset --soft HEAD~1
  ```

### Docker Commands

#### 1. `docker run`
- **Usage**: Runs a command in a new container.
- **Example**: Run "echo" in an Ubuntu container.
  ```bash
  docker run ubuntu echo "Hello World"
  ```

#### 2. `docker images`
- **Usage**: Lists Docker images.
- **Example**:
  ```bash
  docker images
  ```

#### 3. `docker ps`
- **Usage**: Lists running containers.
- **Example**: List all containers (not just running).
  ```bash
  docker ps -a
  ```

#### 4. `docker start/stop`
- **Usage**: Starts or stops one or more stopped containers.
- **Example**: Start a container named "my_container".
  ```bash
  docker start my_container
  ```
  Stop the same container:
  ```bash
  docker stop my_container
  ```

#### 5. `docker pause`
- **Usage**: Pauses all processes within one or more containers.
- **Example**: Pause a container named "my_container".
  ```bash
  docker pause my_container
  ```

#### 6. `docker rm`
- **Usage**: Removes one or more containers.
- **Example**: Remove a container named "my_container".
  ```bash
  docker rm my_container
  ```

#### 7. `docker commit`
- **Usage**: Creates a new image from a container's changes.
- **Example**: Commit a container's changes into a new image named "my_new_image".
  ```bash
  docker commit my_container my_new_image
  ```

#### 8. `docker-compose up/down`
- **Usage**: Starts and stops multi-container Docker applications.
- **Example**: Start services defined in `docker-compose.yml`.
  ```bash
  docker-compose up
  ```
  Stop the services:
  ```bash
  docker-compose down
  ```

### Ansible Commands

#### 1. `ansible`
- **Usage**: Executes a single task on a set of hosts.
- **Example**: Ping all hosts in your inventory.
  ```bash
  ansible all -m ping
  ```

#### 2. `ansible-playbook`
- **Usage**: Executes Ansible playbooks.
- **Example**: Run a playbook named "site.yml".
  ```bash
  ansible-playbook site.yml
  ```

#### 3. `ansible-vault`
- **Usage**: Encrypts and decrypts Ansible data files.
- **Example**: Encrypt a file named "secrets.yml".
  ```bash
  ansible-vault encrypt secrets.yml
  ```

#### 4. `ansible-pull`
- **Usage**: Pulls playbooks from a VCS repo and executes them for the local host.
- **Example**: Pull and execute a playbook from a repository.
  ```bash
  ansible-pull -U https://github.com/user/repo.git
  ```

#### 5. `ansible-galaxy`
- **Usage**: Manages Ansible roles in shared repositories.
- **Example**: Install a role from Ansible Galaxy.
  ```bash
  ansible-galaxy install username.rolename
  ```

### Terraform Commands

#### 1. `terraform init`
- **Usage**: Initializes a Terraform working directory.
- **Example**:
  ```bash
  terraform init
  ```

#### 2. `terraform plan`
- **Usage**: Generates and shows an execution plan.
- **Example**:
  ```bash
  terraform plan
  ```

#### 3. `terraform apply`
- **Usage**: Applies the changes required to reach the desired state of the configuration.
- **Example**:
  ```bash
  terraform apply
  ```

#### 4. `terraform destroy`
- **Usage**: Destroys Terraform-managed infrastructure.
- **Example**:
  ```bash
  terraform destroy
  ```

#### 5. `terraform refresh`
- **Usage**: Updates the state file of your infrastructure with actual physical resources.
- **Example**:
  ```bash
  terraform refresh
  ```

#### 6. `terraform output`
- **Usage**: Reads an output from a Terraform state file and prints it.
- **Example**:
  ```bash
  terraform output instance_ip_addr
  ```

#### 

7. `terraform graph`
- **Usage**: Generates a visual representation of either a configuration or execution plan.
- **Example**:
  ```bash
  terraform graph | dot -Tsvg > graph.svg
  ```

These commands are foundational for version control with Git, container management with Docker, automation with Ansible, and infrastructure management with Terraform, showcasing the versatility and power of these tools in modern development workflows.