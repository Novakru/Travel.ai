## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## 代码提交注意事项
1. 代码统一提交到dev分支，检查无误后，然后再merge到master分支  
```bash
git checkout dev
```
3. 代码提交之前需要拉取仓库，统一其他人的代码进度，可能需要手动解决冲突，在此不赘述 `git pull`
```bash
git pull
```
5. 代码提交命令序列
```bash
git checkout dev   // 切换分支
git add .          // 切换到项目路径后！添加全部文件
git commit -m "commit-message"   
git push
```
**总结：分支要确保是dev，提交前先拉取**


