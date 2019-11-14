export enum WebRouterCbMethod {
  task = 'task',
  note = 'note',
}

export function getTaskOpenUrl(params: { spaceId: number; projectId: number; taskId: number }) {
  return `${process.env.VUE_APP_WEB_BASE_PATH}/cb/${WebRouterCbMethod.task}?s=${params.spaceId}&p=${params.projectId}&t=${params.taskId}`;
}
export function getTaskParamsFromOpenUrl(sparams: URLSearchParams) {
  const spaceIdStr = sparams.get('s');
  const projectIdStr = sparams.get('p');
  const taskIdStr = sparams.get('t');
  if (
    spaceIdStr && projectIdStr && taskIdStr &&
    isFinite(spaceIdStr as any) && isFinite(projectIdStr as any) && isFinite(taskIdStr as any)
  ) {
    return {
      spaceId: parseInt(spaceIdStr),
      projectId: parseInt(projectIdStr),
      taskId: parseInt(taskIdStr),
    };
  }
}

export function getNoteOpenUrl(params: { spaceId: number; projectId: number; noteId: number }) {
  return `${process.env.VUE_APP_WEB_BASE_PATH}/cb/${WebRouterCbMethod.note}?s=${params.spaceId}&p=${params.projectId}&t=${params.noteId}`;
}
export function getNoteParamsFromOpenUrl(sparams: URLSearchParams) {
  const spaceIdStr = sparams.get('s');
  const projectIdStr = sparams.get('p');
  const noteIdStr = sparams.get('t');
  if (
    spaceIdStr && projectIdStr && noteIdStr &&
    isFinite(spaceIdStr as any) && isFinite(projectIdStr as any) && isFinite(noteIdStr as any)
  ) {
    return {
      spaceId: parseInt(spaceIdStr),
      projectId: parseInt(projectIdStr),
      noteId: parseInt(noteIdStr),
    };
  }
}
