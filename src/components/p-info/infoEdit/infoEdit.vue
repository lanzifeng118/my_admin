
<template>
  <div class="info-edit">
    <h2 class="edit-h2">编辑{{ $route.params.id }}</h2>
    <router-link to="/admin/aboutus" class="edit-close-btn" >
      <span class="icon-round_close_fill"></span>
    </router-link>
    <div class="edit-table-wrap">
      <table>
        <tbody>
          <tr>
            <td width="80">标题</td>
            <td><input type="text" v-model="aboutus.title"></td>
          </tr>
          <tr>
            <td>发布人</td>
            <td><input type="text" v-model="aboutus.author"></td>
          </tr>
          <tr>
            <td>显示</td>
            <td
              class="vertical-middle pointer"
              :class="[aboutus.show ? 'show' : 'not-show']"
              @click="toggleShow"
            >
              <span class="icon-square_check_fill"></span>
            </td>
          </tr>
          <tr>
            <td class="vertical-top">摘要</td>
            <td><textarea name="name" rows="3" cols="100"></textarea></td>
          </tr>
          <tr>
            <td>内容</td>
            <td>
              <quill-editor
                v-model="aboutus.detail"
                :options="editorOption"
              >
              </quill-editor>
            </td>
          </tr>
          <tr>
            <td></td>
            <td><button class="button" @click="submit">提交</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
export default {
  data() {
    return {
      // aboutus
      aboutus: {
        title: '',
        author: '',
        show: true,
        summary: '',
        detail: ''
      },
      // editor
      editorOption: { // 编辑器的配置
        placeholder: '输入内容...',
        modules: {
          toolbar: this.$store.state.quillEditor.nomal
        }
      }
    }
  },
  created() {
    this.getItem()
  },
  watch: {
    '$route' (to, from) {
      this.getItem()
    }
  },
  methods: {
    getItem() {
      let _this = this
      _this.axios.get('api/infoDisplay?id=' + _this.$route.params.id).then((response) => {
        _this.aboutus = response.data.data
      })
    },
    toggleShow() {
      this.aboutus.show = !this.aboutus.show
    }
  },
  components: {
    quillEditor
  }
}
</script>

<style>
  .info-edit {
    position: relative;
  }
</style>
