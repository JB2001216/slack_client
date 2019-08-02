<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AjaxError, AjaxTimeoutError } from 'rxjs/ajax';
import { ApiErrors } from '@/lib/api';
import { RouteError } from '@/errors';

@Component
export default class ApiErrorActionBus extends Vue {
  show(vm: Vue, err: any) {
    if (err instanceof RouteError) {
      err = err.data;
    }
    if (err instanceof AjaxError) {
      if (err.response && err.response.error) {
        if (ApiErrors.ValidationError === err.response.error) {
          vm.$flash('入力内容に問題があります', 'error');
          return;
        }
        if (err.response.data && err.response.data.detail) {
          vm.$flash(err.response.data.detail, 'error');
          return;
        }
      }
      if (!err.status) {
        vm.$flash('ネットワーク接続に問題があります', 'error');
        return;
      }
    }

    if (err instanceof AjaxTimeoutError) {
      vm.$flash('サーバーの応答がありません', 'error');
      return;
    }

    vm.$flash('エラーが発生しました', 'error');
  }
}
</script>
