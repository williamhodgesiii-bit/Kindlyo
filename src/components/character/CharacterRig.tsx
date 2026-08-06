import type { SVGProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  characters,
  INK,
  LEG,
  SURFACE,
  type CharacterDef,
  type CharacterId,
  type HairStyle,
} from "./cast";
import {
  characterStates,
  expressions,
  type CharacterState,
  type ExpressionName,
  type FacePose,
  type Pose,
} from "./states";

/**
 * The character rig — one parametric figure that reproduces the whole cast
 * (docs/design/CHARACTER_BIBLE.md). Skin, hair, cast colour, and accessory come
 * from the character; the pose (limb rotations + body tilt) and expression (eyes
 * + brows + mouth) come from the state. Emotion never distorts the face — it is
 * only ever eyes, brows, mouth, and pose.
 *
 * Drawn as inline SVG on the rig's 132×152 grid, so it scales with its box and
 * nests inside a scene's SVG. It is a static / transition swap today — the
 * reduced-motion baseline of the contract — with continuous motion (breathing
 * idles, walk cycles, the celebration hop) a later Rive pass (ASSET_MANIFEST.md).
 *
 * Decorative by default (`aria-hidden`), because a character in a scene is
 * carried by the narration beside it. Pass a `title` on the rare occasion the
 * figure itself is the information, and it becomes a labelled image instead.
 */

type HairStyleProps = { hairColor: string; cast: string };

/** Hair, drawn in the head's local space (origin at the head's top-left). */
function Hair({
  hair,
  hairColor,
  cast,
}: HairStyleProps & { hair: HairStyle }): ReactNode {
  const stroke = { stroke: INK, strokeWidth: 2 };
  switch (hair) {
    case "buns":
      return (
        <>
          <rect x={2} y={-2} width={48} height={17} rx={9} fill={hairColor} />
          <circle cx={2} cy={6} r={8} fill={hairColor} {...stroke} />
          <circle cx={50} cy={6} r={8} fill={hairColor} {...stroke} />
        </>
      );
    case "curly":
      return (
        <>
          <circle cx={8} cy={7} r={12} fill={hairColor} />
          <circle cx={27} cy={3} r={13} fill={hairColor} />
          <circle cx={44} cy={7} r={12} fill={hairColor} />
        </>
      );
    case "braids":
      return (
        <>
          <rect x={0} y={-3} width={52} height={22} rx={11} fill={hairColor} />
          <rect x={-9} y={12} width={11} height={32} rx={6} fill={hairColor} />
          <rect x={50} y={12} width={11} height={32} rx={6} fill={hairColor} />
          <circle cx={-3} cy={42} r={4} fill={cast} />
          <circle cx={55} cy={42} r={4} fill={cast} />
        </>
      );
    case "fringe":
      return (
        <>
          <rect x={0} y={-2} width={52} height={19} rx={10} fill={hairColor} />
          <rect
            x={38}
            y={-10}
            width={7}
            height={14}
            rx={4}
            fill={hairColor}
            transform="rotate(18 41.5 -3)"
          />
        </>
      );
    case "bob":
      return (
        <>
          <rect x={-3} y={-3} width={58} height={21} rx={11} fill={hairColor} />
          <rect x={-5} y={8} width={9} height={26} rx={4} fill={hairColor} />
          <rect x={48} y={8} width={9} height={26} rx={4} fill={hairColor} />
          <rect x={36} y={3} width={11} height={5} rx={2} fill={cast} />
        </>
      );
  }
}

/** Face, drawn in the head's local space. */
function Face({
  face,
  character,
}: {
  face: FacePose;
  character: CharacterDef;
}): ReactNode {
  const dy = face.eyes === "up" ? -3 : face.eyes === "down" ? 2 : 0;
  const parts: ReactNode[] = [];

  if (face.eyes === "closed") {
    parts.push(
      <rect key="el" x={13} y={28} width={8} height={2} rx={1} fill={INK} />,
      <rect key="er" x={31} y={28} width={8} height={2} rx={1} fill={INK} />,
    );
  } else {
    parts.push(
      <circle key="el" cx={16.5} cy={28.5 + dy} r={2.5} fill={INK} />,
      <circle key="er" cx={35.5} cy={28.5 + dy} r={2.5} fill={INK} />,
    );
  }

  if (face.brows === "worry") {
    parts.push(
      <rect
        key="bl"
        x={13}
        y={21}
        width={8}
        height={2}
        rx={1}
        fill={INK}
        transform="rotate(12 17 22)"
      />,
      <rect
        key="br"
        x={31}
        y={21}
        width={8}
        height={2}
        rx={1}
        fill={INK}
        transform="rotate(-12 35 22)"
      />,
    );
  } else if (face.brows === "raise") {
    parts.push(
      <rect key="bl" x={13} y={20} width={8} height={2} rx={1} fill={INK} />,
      <rect key="br" x={31} y={20} width={8} height={2} rx={1} fill={INK} />,
    );
  }

  const m = face.mouth;
  if (m === "smile" || m === "grin") {
    const w = m === "grin" ? 16 : 12;
    const x = m === "grin" ? 18 : 20;
    parts.push(
      <path
        key="mouth"
        d={`M${x} 35 Q${x + w / 2} ${35 + 9} ${x + w} 35`}
        fill="none"
        stroke={INK}
        strokeWidth={2}
        strokeLinecap="round"
      />,
    );
  } else if (m === "small" || m === "flat") {
    parts.push(
      <rect key="mouth" x={22} y={38} width={8} height={2} rx={1} fill={INK} />,
    );
  } else if (m === "wobble") {
    parts.push(
      <rect
        key="mouth"
        x={21}
        y={37}
        width={10}
        height={2}
        rx={1}
        fill={INK}
        transform="rotate(-6 26 38)"
      />,
    );
  } else if (m === "open") {
    parts.push(<circle key="mouth" cx={26.5} cy={39.5} r={4.5} fill={INK} />);
  } else if (m === "o") {
    parts.push(
      <circle
        key="mouth"
        cx={26.5}
        cy={39.5}
        r={3.5}
        fill="none"
        stroke={INK}
        strokeWidth={2}
      />,
    );
  }

  if (face.blush) {
    parts.push(
      <ellipse
        key="bl"
        cx={11.5}
        cy={36}
        rx={3.5}
        ry={2}
        fill={character.soft}
      />,
      <ellipse
        key="br2"
        cx={40.5}
        cy={36}
        rx={3.5}
        ry={2}
        fill={character.soft}
      />,
    );
  }

  // Theo's glasses ride on the curly-hair character.
  if (character.hair === "curly") {
    parts.push(
      <circle
        key="gl"
        cx={16}
        cy={28}
        r={7}
        fill="none"
        stroke={INK}
        strokeWidth={2}
      />,
      <circle
        key="gr"
        cx={36}
        cy={28}
        r={7}
        fill="none"
        stroke={INK}
        strokeWidth={2}
      />,
      <rect key="gb" x={23} y={27} width={6} height={2} fill={INK} />,
    );
  }

  return <>{parts}</>;
}

export type CharacterRigProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  character: CharacterId;
  /** The animation state (pose). Defaults to a calm idle. */
  state?: CharacterState;
  /** Override the state's expression (a head-only swap). */
  expression?: ExpressionName;
  /** Rendered width in px for standalone use; ignored when a `width` is passed. */
  size?: number;
  /** When set, the figure is a labelled image rather than decoration. */
  title?: string;
};

const ARM_LEN = 46;

export function CharacterRig({
  character,
  state = "idle",
  expression,
  size = 96,
  title,
  className,
  ...rest
}: CharacterRigProps) {
  const def = characters[character];
  const pose: Pose = characterStates[state].pose;
  const face: FacePose = expression ? expressions[expression] : pose;
  const labelled = title !== undefined;

  const arm = (x: number, deg: number, len: number | undefined) => (
    <rect
      x={x}
      y={58}
      width={14}
      height={len ?? ARM_LEN}
      rx={7}
      fill={def.skin}
      stroke={INK}
      strokeWidth={2}
      transform={`rotate(${deg} ${x + 7} 65)`}
    />
  );

  return (
    <svg
      viewBox="0 0 132 152"
      width={size}
      height={(size * 152) / 132}
      role={labelled ? "img" : "presentation"}
      aria-hidden={labelled ? undefined : true}
      aria-label={title}
      focusable="false"
      className={cn("block", className)}
      {...rest}
    >
      {labelled ? <title>{title}</title> : null}
      <g
        transform={`translate(0 ${pose.hop ? -4 : 0}) rotate(${pose.tilt} 66 137)`}
      >
        {/* Body */}
        <rect
          x={30}
          y={54}
          width={60}
          height={60}
          rx={13}
          fill={def.cast}
          stroke={INK}
          strokeWidth={2}
        />
        {/* Legs */}
        <rect
          x={40}
          y={112}
          width={15}
          height={30}
          rx={7}
          fill={LEG}
          stroke={INK}
          strokeWidth={2}
        />
        <rect
          x={64}
          y={112}
          width={15}
          height={30}
          rx={7}
          fill={LEG}
          stroke={INK}
          strokeWidth={2}
        />
        {/* Arms */}
        {arm(17, pose.rotL, pose.lenL)}
        {arm(89, pose.rotR, pose.lenR)}
        {/* Nora's card lanyard */}
        {def.hair === "bob" ? (
          <rect
            x={52}
            y={74}
            width={16}
            height={12}
            rx={3}
            fill={SURFACE}
            stroke={INK}
            strokeWidth={2}
          />
        ) : null}
        {/* Head */}
        <g transform="translate(34 4)">
          <circle
            cx={26}
            cy={26}
            r={26}
            fill={def.skin}
            stroke={INK}
            strokeWidth={2}
          />
          <Hair hair={def.hair} hairColor={def.hairColor} cast={def.cast} />
          <Face face={face} character={def} />
        </g>
        {/* Open palm at the extended hand (boundary / permission) */}
        {pose.palm ? (
          <circle
            cx={122.5}
            cy={62.5}
            r={6.5}
            fill={def.skin}
            stroke={INK}
            strokeWidth={2}
          />
        ) : null}
      </g>
    </svg>
  );
}
