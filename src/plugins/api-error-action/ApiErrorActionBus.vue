<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ApiErrors, FetchError } from '@/lib/api';
import { RouteError } from '@/lib/errors';

@Component
export default class ApiErrorActionBus extends Vue {
  async show(vm: Vue, err: any) {
    if (err instanceof RouteError) {
      err = err.data;
    }
    if (err instanceof FetchError) {
      const res = await err.data!.json();
      if (res.error) {
        if (ApiErrors.ValidationError === res.error) {
          vm.$flash('入力内容に問題があります', 'error');
          return;
        }
        if (res.data && res.data.detail) {
          vm.$flash(res.data.detail, 'error');
          return;
        }
      }
      if (!err.data!.status) {
        vm.$flash('ネットワーク接続に問題があります', 'error');
        return;
      }
    }

    vm.$flash('エラーが発生しました', 'error');
  }
}
</script>
