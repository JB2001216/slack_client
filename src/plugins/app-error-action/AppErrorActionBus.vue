<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ApiErrors, getJsonFromResponse } from '@/lib/api';
import { RouteError, BasicError } from '@/lib/errors';

@Component
export default class AppErrorActionBus extends Vue {
  async show(vm: Vue, err: any) {
    if (err instanceof RouteError) {
      err = err.data;
    }

    if (err instanceof Response) {
      const json = await getJsonFromResponse(err);
      if (json && json.error) {
        if (ApiErrors.ValidationError === json.error) {
          vm.$flash(vm.$t('common.invalidInput').toString(), 'error');
          return;
        }
        if (json.data && json.data.detail) {
          vm.$flash(json.data.detail, 'error');
          return;
        }
      }
      if (!err.status) {
        vm.$flash(vm.$t('common.networkConnectionError').toString(), 'error');
        return;
      }

    } else if (err instanceof BasicError) {
      vm.$flash(err.message, 'error');
      return;
    }

    vm.$flash(vm.$t('common.anErrorHasOccurred').toString(), 'error');
  }
}
</script>
