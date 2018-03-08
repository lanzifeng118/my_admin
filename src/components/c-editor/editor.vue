<template>
  <div class="editor">
    <quill-editor
      v-model="content"
      :options="editorOption"
      ref="myTextEditor"
      @change="onChange"
    >
      <div id="toolbar" slot="toolbar">
        <span class="ql-formats">
          <button type="button" class="ql-bold"></button>
          <button type="button" class="ql-italic"></button>
          <select class="ql-align">
            <option selected="selected"></option>
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
          </select>
        </span>
        <span class="ql-formats">
          <select class="ql-header">
            <option value="1">标题1</option>
            <option value="2">蓝标题</option>
            <option value="3">黄标题</option>
            <option value="4">红标题</option>
            <option value="5">灰标题</option>
            <option value="6">段落缩进</option>
            <option selected="selected">段落</option>
          </select>
          <select class="ql-size">
            <option value="small">0.75倍</option>
            <option selected>1.0倍</option>
            <option value="large">1.2倍</option>
            <option value="huge">1.5倍</option>
          </select>
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-indent" value="+1"></button>
          <button type="button" class="ql-indent" value="-1"></button>
        </span> 
        <span class="ql-formats">
          <select class="ql-color">
           <option selected="selected"></option>
           <option value="#e60000"></option>
           <option value="#ff9900"></option>
           <option value="#ffff00"></option>
           <option value="#008a00"></option>
           <option value="#0066cc"></option>
           <option value="#9933ff"></option>
           <option value="#ffffff"></option>
           <option value="#facccc"></option>
           <option value="#ffebcc"></option>
           <option value="#ffffcc"></option>
           <option value="#cce8cc"></option>
           <option value="#cce0f5"></option>
           <option value="#ebd6ff"></option>
           <option value="#bbbbbb"></option>
           <option value="#f06666"></option>
           <option value="#ffc266"></option>
           <option value="#ffff66"></option>
           <option value="#66b966"></option>
           <option value="#66a3e0"></option>
           <option value="#c285ff"></option>
           <option value="#888888"></option>
           <option value="#a10000"></option>
           <option value="#b26b00"></option>
           <option value="#b2b200"></option>
           <option value="#006100"></option>
           <option value="#0047b2"></option>
           <option value="#6b24b2"></option>
           <option value="#444444"></option>
           <option value="#5c0000"></option>
           <option value="#663d00"></option>
           <option value="#666600"></option>
           <option value="#003700"></option>
           <option value="#002966"></option>
           <option value="#3d1466"></option>
         </select>
         <select class="ql-background">
           <option value="#000000"></option>
           <option value="#e60000"></option>
           <option value="#ff9900"></option>
           <option value="#ffff00"></option>
           <option value="#008a00"></option>
           <option value="#0066cc"></option>
           <option value="#9933ff"></option>
           <option selected="selected"></option>
           <option value="#facccc"></option>
           <option value="#ffebcc"></option>
           <option value="#ffffcc"></option>
           <option value="#cce8cc"></option>
           <option value="#cce0f5"></option>
           <option value="#ebd6ff"></option>
           <option value="#bbbbbb"></option>
           <option value="#f06666"></option>
           <option value="#ffc266"></option>
           <option value="#ffff66"></option>
           <option value="#66b966"></option>
           <option value="#66a3e0"></option>
           <option value="#c285ff"></option>
           <option value="#888888"></option>
           <option value="#a10000"></option>
           <option value="#b26b00"></option>
           <option value="#b2b200"></option>
           <option value="#006100"></option>
           <option value="#0047b2"></option>
           <option value="#6b24b2"></option>
           <option value="#444444"></option>
           <option value="#5c0000"></option>
           <option value="#663d00"></option>
           <option value="#666600"></option>
           <option value="#003700"></option>
           <option value="#002966"></option>
           <option value="#3d1466"></option>
         </select>
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-list" value="ordered"></button>
          <button type="button" class="ql-list" value="bullet"></button>
        </span>
        <span class="ql-formats">
         <button type="button" class="ql-link"></button>
         <button type="button" @click="imgClick">
           <svg viewBox="0 0 18 18">
             <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
             <circle class="ql-fill" cx="6" cy="7" r="1"></circle>
             <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
           </svg>
         </button>
       </span>
        <span class="ql-formats">
         <button type="button" class="ql-clean"></button>
       </span>
      </div>
    </quill-editor>
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
import util from 'components/tools/util'

export default {
  props: ['value'],
  data() {
    return {
      // editor
      editorOption: { // 编辑器的配置
        placeholder: '输入内容...',
        modules: {
          toolbar: '#toolbar'
        }
      },
      content: ''
    }
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill
    }
  },
  mounted() {
    this.content = this.value
  },
  watch: {
    'value'(newVal, oldVal) {
      if (this.editor) {
        if (newVal !== this.content) {
          this.content = newVal
        }
      }
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.content)
    },
    imgClick() {
      let input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/jpeg,image/png,image/jpg,image/gif'
      input.onchange = this.onFileChange
      input.click()
    },
    onFileChange(e) {
      let file = e.target.files[0]
      this.uploadFile(file, (url) => {
        this.editor.focus()
        this.editor.insertEmbed(this.editor.getSelection().index, 'image', url)
      })
    },
    uploadFile(file, callback) {
      let _this = this
      util.uploadFile(this, file, callback, () => {
        _this.showError()
      })
    },
    showError() {
      util.req.changeError(this.toast)
    }
  },
  components: {
    quillEditor
  }
}
</script>
<style>
.editor .quill-editor {
  line-height: 1.5em;
}
/* 标题 */
.editor .quill-editor  h1 {
  font-size: 16px;
  line-height: 1.5em;
  color: #0d93b8;
  font-weight: bold;
}
.editor .quill-editor h2, 
.editor .quill-editor h3,
.editor .quill-editor h4 {
  font-size: 14px;
  line-height: 1.5em;    
  padding-left: 10px;
  border-left: 2px solid #0d93b8;
}
.editor .quill-editor h3 {
  border-color: #ffc107;
}
.editor .quill-editor h4 {
  border-color: #ff5722;
}
.editor .quill-editor h5 {
  padding: 5px 10px;
  line-height: 1.5em;
  color: #999;
  border-left: 2px solid #ebebeb;
  background-color: #f5f5f5;
  font-size: 12px;
}
/* 段落 */
.editor .quill-editor h6,
.editor .quill-editor p {
  font-size: 14px;
  line-height: 1.5em;
}
.editor .quill-editor h6 {
  text-indent: 2rem;
}
/* img */
.editor img {
  max-width: 100%;
}
/* ul,ol */
.editor .quill-editor ul,
.editor .quill-editor ol {
  padding-left: 0;
}
.editor .quill-editor li {
  font-size: 14px;
  line-height: 1.5em;
  position: relative;
  display: block;
  padding: 0 0 0 12px !important;
}
.editor .quill-editor li::before {
  content: '';
  margin-left: 0;
  margin-right: 0;
  position: absolute;
  width: 4px;
  height: 4px;
  background: #86b513;
  top: 8px;
  left: 0px;
}
.editor .quill-editor ol > li::before {
  border-radius: 2px;
}
/* size */
.editor .ql-editor .ql-size-large {
  font-size: 1.2em;
}
.editor .ql-editor .ql-size-huge {
  font-size: 1.5em;
}
/* a */
.editor .ql-editor a {
  color: #333;
  text-decoration: underline;
}
/* ql-indent */
.editor .ql-editor .ql-indent-1 {
  padding-left: 1rem;
}
.editor .ql-editor .ql-indent-2 {
  padding-left: 2rem;
}
.editor .ql-editor .ql-indent-3 {
  padding-left: 3rem;
}
.editor .ql-editor .ql-indent-4 {
  padding-left: 4rem;
}
.editor .ql-editor .ql-indent-5 {
  padding-left: 5rem;
}
.editor .ql-editor .ql-indent-6 {
  padding-left: 6rem;
}
.editor .ql-editor .ql-indent-7 {
  padding-left: 7rem;
}
.editor .ql-editor .ql-indent-8 {
  padding-left: 8rem;
}
</style>
