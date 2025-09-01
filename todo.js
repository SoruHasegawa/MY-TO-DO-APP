//TODOリストの管理クラス
class TodoList {
    constructor() {
        //DOM要素取得
        this.taskinput = document.getElementById('taskinput');
        this.addbtn = document.getElementById('addbtn');
        this.tasklist = document.getElementById('tasklist');

        //ローカルストレージからタスクを取得
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        //イベントリスナー設定
        this.addbtn.addEventListener('click', () => this.addTask());
        this.taskinput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        //初期表示
        this.renderTasks();
    
    }
    //タスク追加
    addTask() {
        const taskText = this.taskinput.value.trim();
        if (!taskText) return; //空入力は無視 
            
        const last = this.tasks[this.tasks.length - 1];
        if (last && last.text === taskText) {
            this.taskinput.value = '';
            this.taskinput.focus();
            return;
        }

        //新しいタスクを追加
        this.tasks.push({ id: Date.now(), text: taskText, completed: false });

        //入力フィールドをクリア
        this.taskinput.value = '';

        //タスクを保存して表示を更新
        this.saveTasks();
        this.renderTasks();
    }

    //タスク削除
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    //タスクの完了状態を切り替え
    toggleTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    //タスクをローカルストレージに保存
    saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    //タスク一覧を表示
    renderTasks() {
    //タスク一覧をクリア
    this.tasklist.innerHTML = '';

    //各タスクの要素を作成
    this.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'taskitem' + (task.completed ? ' completed' : '');

        //完了状態のチェックボックス
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => this.toggleTask(task.id));
        li.appendChild(checkbox);

        //タスクテキスト
        const span = document.createElement('span');
        span.className='task-text';
        span.textContent = task.text;
        li.appendChild(span);

        //削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'deletebtn';
        deleteBtn.textContent = '削除';
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
        li.appendChild(deleteBtn);


        //タスクをリストに追加
        this.tasklist.appendChild(li);
    });
    }
}

//アプリの初期化
document.addEventListener('DOMContentLoaded', () => {
    new TodoList();
});